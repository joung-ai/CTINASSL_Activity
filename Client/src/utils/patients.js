export const LONG_WAIT_MINUTES = 30

export function minutesSince(iso, now) {
  return Math.max(0, Math.floor((now - new Date(iso)) / 60000))
}

export function formatWait(minutes) {
  if (minutes < 60) return `${minutes} min`
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

// Triage level first, then earliest arrival.
export function byAcuity(a, b) {
  return a.level - b.level || new Date(a.arrivedAt) - new Date(b.arrivedAt)
}

export function currentShift(date) {
  const hour = date.getHours()
  if (hour >= 7 && hour < 15) return 'Day shift 07:00–15:00'
  if (hour >= 15 && hour < 23) return 'Evening shift 15:00–23:00'
  return 'Night shift 23:00–07:00'
}
