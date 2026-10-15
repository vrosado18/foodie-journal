import type { SVGProps } from 'react'

export function FumbleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <ellipse cx="12" cy="12" rx="8" ry="5.5" transform="rotate(-20 12 12)" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 16l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function PuntIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <ellipse cx="9" cy="15" rx="4.5" ry="3" transform="rotate(-20 9 15)" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13 11l6-6m0 0h-4m4 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FirstDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 4v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 5l12 4-12 4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function TouchdownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 20V11M18 20V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 11l6-7 6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HailMaryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 2l1.4 4.1L17.5 6l-3 3 1 4.3L12 11l-3.5 2.3 1-4.3-3-3 4.1.1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 16v6M9 19h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
