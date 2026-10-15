export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(iso),
  )
}

const RELATIVE_UNITS: [number, Intl.RelativeTimeFormatUnit][] = [
  [60, 'second'],
  [60, 'minute'],
  [24, 'hour'],
  [7, 'day'],
  [4.345, 'week'],
  [12, 'month'],
  [Number.POSITIVE_INFINITY, 'year'],
]

export function formatRelativeDate(iso: string): string {
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })
  let diffSeconds = (new Date(iso).getTime() - Date.now()) / 1000

  for (const [limit, unit] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) < limit) {
      return rtf.format(Math.round(diffSeconds), unit)
    }
    diffSeconds /= limit
  }
  return formatDate(iso)
}
