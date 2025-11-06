/**
 * Generate URL-friendly slug from text
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Calculate end time from start time and duration
 */
export const calculateEndTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

/**
 * Check if time slots overlap
 */
export const doTimeSlotsOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

/**
 * Format price for display
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

/**
 * Format date for display
 */
export const formatDate = (date, locale = 'es-ES') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

/**
 * Generate time slots for a given day
 */
export const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
  const slots = [];
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let currentMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  while (currentMinutes < endTotalMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    currentMinutes += intervalMinutes;
  }

  return slots;
};

/**
 * Check if date is in the past
 */
export const isDateInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get day of week (0 = Sunday, 1 = Monday, etc.)
 */
export const getDayOfWeek = (date) => {
  return new Date(date).getDay();
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Generate random alphanumeric string
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Parse time string to minutes since midnight
 */
export const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};
