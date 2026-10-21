/**
 * Nirvaya Eyecare Centre — Clinical Scheduling & Slot Rules
 * Time Zone: Asia/Kolkata (IST = UTC+05:30)
 */

export const TIME_ZONE = 'Asia/Kolkata';
export const TIME_ZONE_OFFSET_MINUTES = 330; // +05:30

export const SCHEDULE_SETTINGS = {
  timeZone: TIME_ZONE,
  timeZoneLabel: 'All times are in IST (Indian Standard Time)',
  slotDurationMinutes: 30,
  bookingWindowDays: 30,
  minNoticeMinutes: 120, // 2 hours minimum advance notice
  capacityPerSlot: 1 // 1 patient per discrete slot
};

export const DOCTOR_SCHEDULES = {
  'doc-sandhya-01': {
    name: 'Dr. Sandhya Gaur',
    specialty: 'Retina & Vitreoretinal Surgery',
    workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat (0 is Sun)
    sessions: [
      { start: '09:00', end: '13:00', period: 'Morning' },
      { start: '14:00', end: '17:00', period: 'Afternoon' }
    ]
  },
  'doc-neha-02': {
    name: 'Dr. Neha Saxena',
    specialty: 'Cornea & Refractive Services',
    workingDays: [1, 3, 5], // Mon, Wed, Fri
    sessions: [
      { start: '09:30', end: '13:00', period: 'Morning' }
    ]
  },
  'doc-vikram-03': {
    name: 'Dr. Vikram Agrawal',
    specialty: 'Glaucoma & Comprehensive Ophthalmology',
    workingDays: [2, 4, 6], // Tue, Thu, Sat
    sessions: [
      { start: '14:00', end: '18:00', period: 'Afternoon' }
    ]
  }
};

/**
 * Get current date in Asia/Kolkata as 'YYYY-MM-DD'
 */
export function getTodayInHospitalTz() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date());
}

/**
 * Get date string N days from today in Asia/Kolkata
 */
export function getMaxBookingDateInHospitalTz() {
  const future = new Date(Date.now() + SCHEDULE_SETTINGS.bookingWindowDays * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(future);
}

/**
 * Get Day of Week (0 = Sun, 1 = Mon ... 6 = Sat) for an IST date YYYY-MM-DD
 */
export function getDayOfWeekInHospitalTz(dateStr) {
  const d = new Date(`${dateStr}T12:00:00+05:30`);
  return d.getUTCDay();
}

/**
 * Convert YYYY-MM-DD + HH:mm in IST to exact ISO string in UTC
 */
export function istTimeToUtcIso(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, min] = timeStr.split(':').map(Number);
  const utcMillis = Date.UTC(year, month - 1, day, hour, min) - (5 * 60 + 30) * 60000;
  return new Date(utcMillis).toISOString();
}

/**
 * Format 24h '09:30' into 12h '09:30 AM'
 */
export function formatTime12h(time24) {
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${String(hour).padStart(2, '0')}:${minStr} ${ampm}`;
}

/**
 * Generate discrete 30-minute time intervals between session start and end
 */
export function generateSessionSlots(start24, end24, period) {
  const slots = [];
  const [startH, startM] = start24.split(':').map(Number);
  const [endH, endM] = end24.split(':').map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + SCHEDULE_SETTINGS.slotDurationMinutes <= endMinutes) {
    const slotH = Math.floor(currentMinutes / 60);
    const slotM = currentMinutes % 60;
    const time24 = `${String(slotH).padStart(2, '0')}:${String(slotM).padStart(2, '0')}`;

    const endSlotMinutes = currentMinutes + SCHEDULE_SETTINGS.slotDurationMinutes;
    const endSlotH = Math.floor(endSlotMinutes / 60);
    const endSlotM = endSlotMinutes % 60;
    const endTime24 = `${String(endSlotH).padStart(2, '0')}:${String(endSlotM).padStart(2, '0')}`;

    const slotId = `slot_${time24.replace(':', '')}`;

    slots.push({
      slotId,
      time24,
      endTime24,
      displayTime: formatTime12h(time24),
      displayEndTime: formatTime12h(endTime24),
      period
    });

    currentMinutes += SCHEDULE_SETTINGS.slotDurationMinutes;
  }

  return slots;
}

/**
 * Resolve doctor schedule configuration
 */
export function getDoctorSchedule(doctorId) {
  return DOCTOR_SCHEDULES[doctorId] || DOCTOR_SCHEDULES['doc-sandhya-01'];
}

/**
 * Generate human-friendly booking reference (e.g. NIRV-202610-4821)
 */
export function generateBookingRef() {
  const d = new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `NIRV-${yearMonth}-${randomSuffix}`;
}

/**
 * Generate all canonical slots for a doctor on a specific IST date
 */
export function getDoctorSlotsForDate(doctorId, dateStr, existingBookings = [], blockedDates = []) {
  const doctor = getDoctorSchedule(doctorId);
  const todayStr = getTodayInHospitalTz();
  const maxBookingStr = getMaxBookingDateInHospitalTz();

  // 1. Check date boundaries
  if (dateStr < todayStr) {
    return { isBlocked: true, reason: 'Past date', slots: [], groupedSlots: {} };
  }
  if (dateStr > maxBookingStr) {
    return { isBlocked: true, reason: 'Outside 30-day booking window', slots: [], groupedSlots: {} };
  }

  // 2. Check blocked date record
  const blockedRecord = (blockedDates || []).find((b) => b.date === dateStr);
  if (blockedRecord) {
    return { isBlocked: true, reason: blockedRecord.reason || 'Clinic Holiday', slots: [], groupedSlots: {} };
  }

  // 3. Check doctor's scheduled working days
  const dayOfWeek = getDayOfWeekInHospitalTz(dateStr);
  if (!doctor.workingDays.includes(dayOfWeek)) {
    return {
      isBlocked: true,
      reason: dayOfWeek === 0 ? 'Sunday Clinic Closure (Emergency OPD only)' : `${doctor.name} is not on duty today`,
      slots: [],
      groupedSlots: {}
    };
  }

  // 4. Generate all session slots
  const allSlots = [];
  const groupedSlots = {
    Morning: [],
    Afternoon: [],
    Evening: []
  };

  const nowTime = Date.now();
  const minNoticeMs = SCHEDULE_SETTINGS.minNoticeMinutes * 60 * 1000;

  for (const session of doctor.sessions) {
    const sessionSlots = generateSessionSlots(session.start, session.end, session.period);
    for (const s of sessionSlots) {
      const startTimeUtc = istTimeToUtcIso(dateStr, s.time24);
      const endTimeUtc = istTimeToUtcIso(dateStr, s.endTime24);
      const slotStartTimeMs = new Date(startTimeUtc).getTime();

      let isAvailable = true;
      let reason = null;

      // Notice check
      if (slotStartTimeMs - nowTime < minNoticeMs) {
        isAvailable = false;
        reason = slotStartTimeMs < nowTime ? 'Time has passed' : `Requires ${SCHEDULE_SETTINGS.minNoticeMinutes} mins notice`;
      }

      // Existing booking check
      if (isAvailable) {
        const isBooked = existingBookings.some((b) =>
          b.doctorId === doctorId &&
          b.preferredDate === dateStr &&
          (b.slotId === s.slotId || b.preferredSlot === s.displayTime) &&
          b.status !== 'cancelled'
        );
        if (isBooked) {
          isAvailable = false;
          reason = 'Booked';
        }
      }

      const slotObj = {
        ...s,
        startTimeUtc,
        endTimeUtc,
        isAvailable,
        reason
      };

      allSlots.push(slotObj);
      if (groupedSlots[s.period]) {
        groupedSlots[s.period].push(slotObj);
      }
    }
  }

  // Clean empty periods
  const cleanGrouped = {};
  for (const period of ['Morning', 'Afternoon', 'Evening']) {
    if (groupedSlots[period] && groupedSlots[period].length > 0) {
      cleanGrouped[period] = groupedSlots[period];
    }
  }

  return {
    isBlocked: false,
    reason: null,
    slots: allSlots,
    groupedSlots: cleanGrouped
  };
}
