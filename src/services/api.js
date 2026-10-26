/**
 * Nirvaya Eyecare Centre — Frontend API Service
 * Connects the Next.js client components directly to Next.js Route Handlers.
 */

const API_BASE = '/api';

/**
 * Get or create unique visitor session ID for CRP funnel tracking
 */
export function getVisitorSessionId() {
  if (typeof window === 'undefined') return 'server_session';
  let sessionId = localStorage.getItem('nirvaya_session_id');
  if (!sessionId) {
    sessionId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('nirvaya_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Detect device type for CRP analytics
 */
function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Generic Fetch Wrapper with JSON decoding and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nirvaya_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const error = new Error(data?.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

  } catch (err) {
    const isAborted =
      err.name === 'AbortError' ||
      err.name === 'CanceledError' ||
      err.code === 20 ||
      options?.signal?.aborted ||
      (typeof err.message === 'string' && (
        err.message.includes('aborted') ||
        err.message.includes('abort') ||
        err.message.includes('canceled')
      ));

    if (!isAborted) {
      console.error(`[API Service] ${endpoint} Error:`, err.message);
    }
    throw err;
  }
}

// -------------------------------------------------------------
// 1. CRP Visitor & Funnel Telemetry
// -------------------------------------------------------------
export async function trackEvent(eventType, metadata = {}) {
  if (typeof window === 'undefined') return null;
  try {
    const sessionId = getVisitorSessionId();
    return await request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        eventType,
        sessionId,
        path: window.location.pathname + window.location.hash,
        referrer: document.referrer || 'Direct',
        device: getDeviceType(),
        metadata
      })
    });
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// 2. Doctors & Specialists Directory
// -------------------------------------------------------------
export async function getDoctors(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/doctors${query ? `?${query}` : ''}`);
}

export async function getDoctorBySlug(slugOrId) {
  return request(`/doctors/${slugOrId}`);
}

// -------------------------------------------------------------
// 3. Slot Booking & Availability (Interactive Calendar System)
// -------------------------------------------------------------
export async function getDoctorAvailability(doctorId, month, options = {}) {
  const params = new URLSearchParams({ doctorId, month });
  return request(`/availability?${params.toString()}`, {
    signal: options.signal,
    cache: 'no-store'
  });
}

export async function getDoctorSlots(doctorId, date, options = {}) {
  const params = new URLSearchParams({ doctorId, date });
  return request(`/slots?${params.toString()}`, {
    signal: options.signal,
    cache: 'no-store'
  });
}

export async function createAppointmentBooking(bookingPayload, idempotencyKey = null) {
  const sessionId = getVisitorSessionId();
  const headers = {};
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  return request('/bookings', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...bookingPayload,
      sessionId
    })
  });
}

export async function getAvailableSlots(date, doctorId = null) {
  const params = new URLSearchParams({ date });
  if (doctorId) params.append('doctorId', doctorId);
  return request(`/slots/available?${params.toString()}`);
}

export async function bookAppointment(formData) {
  const sessionId = getVisitorSessionId();
  return request('/appointments', {
    method: 'POST',
    body: JSON.stringify({
      ...formData,
      sessionId
    })
  });
}

// -------------------------------------------------------------
// 4. Clinical Blogs & Articles
// -------------------------------------------------------------
export async function getBlogs(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/blogs${query ? `?${query}` : ''}`);
}

export async function getBlogCategories() {
  return request('/blogs/categories');
}

export async function getBlogBySlug(slugOrId) {
  return request(`/blogs/${slugOrId}`);
}

export async function createBlog(blogData) {
  return request('/blogs', {
    method: 'POST',
    body: JSON.stringify(blogData)
  });
}

export async function deleteBlog(id) {
  return request(`/blogs/${id}`, {
    method: 'DELETE'
  });
}

// -------------------------------------------------------------
// 5. Research Papers & Publications
// -------------------------------------------------------------
export async function getResearchPapers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/papers${query ? `?${query}` : ''}`);
}

export async function getPaperBySlug(slugOrId) {
  return request(`/papers/${slugOrId}`);
}

export async function createPaper(paperData) {
  return request('/papers', {
    method: 'POST',
    body: JSON.stringify(paperData)
  });
}

export async function deletePaper(id) {
  return request(`/papers/${id}`, {
    method: 'DELETE'
  });
}

// -------------------------------------------------------------
// 6. Knowledge Hub Dual-Card Overview
// -------------------------------------------------------------
export async function getResourceHub() {
  return request('/resources/hub');
}

// -------------------------------------------------------------
// 7. Admin & Staff Authentication
// -------------------------------------------------------------
export async function adminLogin(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.token) {
    const fullUser = {
      ...data.user,
      role: data.role,
      mustChangePassword: Boolean(data.mustChangePassword)
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('nirvaya_token', data.token);
      localStorage.setItem('nirvaya_user', JSON.stringify(fullUser));
    }
    return { ...data, user: fullUser };
  }
  return data;
}

export function adminLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nirvaya_token');
    localStorage.removeItem('nirvaya_user');
  }
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('nirvaya_user') || 'null');
  } catch {
    return null;
  }
}

export async function getMe() {
  return request('/auth/me');
}

export async function changePassword(payload) {
  const data = await request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (data?.token && typeof window !== 'undefined') {
    localStorage.setItem('nirvaya_token', data.token);
    if (data.user) {
      const fullUser = {
        ...data.user,
        role: data.role
      };
      localStorage.setItem('nirvaya_user', JSON.stringify(fullUser));
    }
  }
  return data;
}

// -------------------------------------------------------------
// 8. CRP Funnel & Realtime Analytics
// -------------------------------------------------------------
export async function getCrpAnalytics(period = '30d') {
  return request(`/analytics/crp?period=${encodeURIComponent(period)}`);
}

export async function getLiveStats() {
  return request('/analytics/live');
}

// -------------------------------------------------------------
// 9. Appointments Management
// -------------------------------------------------------------
export async function getAdminAppointments(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/appointments${query ? `?${query}` : ''}`);
}

export async function getAppointmentSummary() {
  return request('/appointments/summary');
}

export async function updateAppointmentStatus(id, status, notes = '') {
  return request(`/appointments/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes })
  });
}

export async function deleteAppointment(id) {
  return request(`/appointments/${id}`, {
    method: 'DELETE'
  });
}

// -------------------------------------------------------------
// 10. Dynamic Positions & Granular RBAC
// -------------------------------------------------------------
export async function getRoles() {
  return request('/roles');
}

export async function getPermissionsCatalog() {
  return request('/roles/permissions');
}

export async function createRole(roleData) {
  return request('/roles', {
    method: 'POST',
    body: JSON.stringify(roleData)
  });
}

export async function updateRole(id, roleData) {
  return request(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roleData)
  });
}

export async function deleteRole(id) {
  return request(`/roles/${id}`, {
    method: 'DELETE'
  });
}

export async function createStaffUser(userData) {
  return request('/staff', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

// -------------------------------------------------------------
// 11. Slot Configuration & Date Blocking
// -------------------------------------------------------------
export async function getSlotConfig() {
  return request('/slots/config');
}

export async function updateSlotConfig(configData) {
  return request('/slots/config', {
    method: 'PUT',
    body: JSON.stringify(configData)
  });
}

export async function getBlockedDates() {
  return request('/slots/blocked-dates');
}

export async function blockDate(blockData) {
  return request('/slots/block-date', {
    method: 'POST',
    body: JSON.stringify(blockData)
  });
}

export async function unblockDate(id) {
  return request(`/slots/unblock-date/${id}`, {
    method: 'DELETE'
  });
}
