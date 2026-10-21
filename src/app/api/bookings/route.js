import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { Appointment, BlockedDate, IdempotencyKey, AnalyticsEvent } from '@/models';
import {
  TIME_ZONE,
  SCHEDULE_SETTINGS,
  getDoctorSchedule,
  getDoctorSlotsForDate,
  generateBookingRef
} from '@/lib/scheduleConfig';

export async function POST(req) {
  try {
    await connectDB();
    const rawBody = await req.json();
    const idempotencyKey = req.headers.get('idempotency-key') || req.headers.get('Idempotency-Key');

    // 1. Idempotency verification
    if (idempotencyKey) {
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(rawBody || {}))
        .digest('hex');

      const existingRecord = await IdempotencyKey.findOne({ key: idempotencyKey });
      if (existingRecord) {
        if (existingRecord.requestHash === payloadHash) {
          return NextResponse.json(existingRecord.responseBody, {
            status: existingRecord.responseStatus
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              code: 'IDEMPOTENCY_KEY_REUSE',
              message: 'Idempotency key already used for a different request payload'
            },
            { status: 422 }
          );
        }
      }
    }

    // 2. Validate input fields
    const {
      doctorId = 'doc-sandhya-01',
      date,
      slotId,
      patientName,
      phone,
      email = '',
      reason = '',
      consent = true,
      source = 'website',
      sessionId = null
    } = rawBody;

    if (!patientName || patientName.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Please provide a valid patient name (minimum 2 characters)'
        },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Please provide a valid 10-digit mobile number'
        },
        { status: 400 }
      );
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Valid appointment date (YYYY-MM-DD) is required'
        },
        { status: 400 }
      );
    }

    if (!slotId) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Please select an available time slot'
        },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          success: false,
          code: 'CONSENT_REQUIRED',
          message: 'Patient consent is required to confirm reservation'
        },
        { status: 400 }
      );
    }

    const doctor = getDoctorSchedule(doctorId);

    // 3. Verify slot validity at server time
    const doctorAppointments = await Appointment.find({
      doctorId,
      preferredDate: date,
      status: { $ne: 'cancelled' }
    });
    const blockedDates = await BlockedDate.find({});

    const slotResult = getDoctorSlotsForDate(doctorId, date, doctorAppointments, blockedDates);

    if (slotResult.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          code: 'DATE_UNAVAILABLE',
          message: `Date ${date} is unavailable: ${slotResult.reason}`
        },
        { status: 400 }
      );
    }

    const targetSlot = slotResult.slots.find((s) => s.slotId === slotId);
    if (!targetSlot) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_SLOT',
          message: `Slot "${slotId}" is not valid for ${doctor.name} on ${date}`
        },
        { status: 400 }
      );
    }

    // Check notice window
    const nowTime = Date.now();
    const slotStartMs = new Date(targetSlot.startTimeUtc).getTime();
    const minNoticeMs = SCHEDULE_SETTINGS.minNoticeMinutes * 60 * 1000;

    if (slotStartMs - nowTime < minNoticeMs) {
      return NextResponse.json(
        {
          success: false,
          code: 'NOTICE_WINDOW_PASSED',
          message: `The selected slot requires at least ${SCHEDULE_SETTINGS.minNoticeMinutes} minutes advance notice. Please select a later slot.`
        },
        { status: 400 }
      );
    }

    // 4. ATOMIC CONDITIONAL CLAIM: Check for slot conflict
    const conflictDoc = await Appointment.findOne({
      doctorId,
      preferredDate: date,
      slotId,
      status: { $ne: 'cancelled' }
    });

    if (conflictDoc) {
      return NextResponse.json(
        {
          success: false,
          code: 'SLOT_CONFLICT',
          message: 'This time slot was just booked by another patient. Please choose another available time.'
        },
        { status: 409 }
      );
    }

    // 5. Persist the booking
    const bookingRef = generateBookingRef();
    const newAppointmentData = {
      id: crypto.randomUUID(),
      bookingRef,
      patientName: patientName.trim(),
      phone: cleanPhone,
      email: (email || '').trim().toLowerCase() || null,
      doctorId,
      assignedDoctor: doctor.name,
      specialty: doctor.specialty,
      preferredDate: date,
      preferredSlot: targetSlot.displayTime,
      slotId: targetSlot.slotId,
      startTimeUtc: targetSlot.startTimeUtc,
      endTimeUtc: targetSlot.endTimeUtc,
      reason: (reason || '').trim(),
      status: 'confirmed',
      source,
      sessionId
    };

    let savedAppointment;
    try {
      savedAppointment = await Appointment.create(newAppointmentData);
    } catch (mongoErr) {
      if (mongoErr.code === 11000) {
        return NextResponse.json(
          {
            success: false,
            code: 'SLOT_CONFLICT',
            message: 'This time slot was just booked by another patient. Please choose another available time.'
          },
          { status: 409 }
        );
      }
      throw mongoErr;
    }

    // 6. Record analytics conversion event
    try {
      await AnalyticsEvent.create({
        eventType: 'appointment_booked',
        sessionId: sessionId || `anon_${crypto.randomUUID().substring(0, 8)}`,
        path: '/pre-book',
        metadata: {
          appointmentId: savedAppointment.id,
          bookingRef: savedAppointment.bookingRef,
          doctorId: savedAppointment.doctorId,
          slotId: savedAppointment.slotId,
          date: savedAppointment.preferredDate,
          time: savedAppointment.preferredSlot,
          source
        }
      });
    } catch (trackErr) {
      console.warn('[bookings] Analytics tracking non-fatal error:', trackErr.message);
    }

    const responseBody = {
      success: true,
      message: 'Your appointment has been successfully scheduled.',
      booking: {
        id: savedAppointment.id,
        bookingRef: savedAppointment.bookingRef,
        patientName: savedAppointment.patientName,
        phone: savedAppointment.phone,
        email: savedAppointment.email,
        doctorId: savedAppointment.doctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        preferredDate: savedAppointment.preferredDate,
        preferredSlot: savedAppointment.preferredSlot,
        slotId: savedAppointment.slotId,
        startTimeUtc: savedAppointment.startTimeUtc,
        endTimeUtc: savedAppointment.endTimeUtc,
        timeZone: TIME_ZONE,
        timeZoneLabel: SCHEDULE_SETTINGS.timeZoneLabel,
        status: savedAppointment.status,
        createdAt: savedAppointment.createdAt
      }
    };

    // 7. Store idempotency key if requested
    if (idempotencyKey) {
      try {
        const payloadHash = crypto
          .createHash('sha256')
          .update(JSON.stringify(rawBody || {}))
          .digest('hex');

        await IdempotencyKey.create({
          key: idempotencyKey,
          requestHash: payloadHash,
          responseStatus: 201,
          responseBody
        });
      } catch (idemErr) {
        console.warn('[bookings] Idempotency storage non-fatal error:', idemErr.message);
      }
    }

    return NextResponse.json(responseBody, { status: 201 });
  } catch (err) {
    console.error('[api/bookings] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process appointment booking',
        error: err.message
      },
      { status: 500 }
    );
  }
}
