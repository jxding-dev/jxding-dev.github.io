// 의존성 없는 인라인 라인 아이콘. color 는 currentColor 를 따른다.
const PATHS = {
  logo: (
    <>
      <path d="M12 4v16" />
      <path d="M5.1 8l13.8 8" />
      <path d="M18.9 8 5.1 16" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 10.6a5.5 5.5 0 0 1 11 0v4.2l1.5 2.5H5l1.5-2.5z" />
      <path d="M10 20a2.4 2.4 0 0 0 4 0" />
      <path d="M12 4.2V2.8" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4" />
      <path d="M12 18.8v2.4" />
      <path d="m4.2 5.2 1.7 1.7" />
      <path d="m18.1 17.1 1.7 1.7" />
      <path d="M2.8 12h2.4" />
      <path d="M18.8 12h2.4" />
      <path d="m4.2 18.8 1.7-1.7" />
      <path d="m18.1 6.9 1.7-1.7" />
    </>
  ),
  flame: (
    <path d="M12.4 21a6 6 0 0 0 5.8-6.2c0-3.2-2-5-4.4-7.4-.6 2.4-1.8 3.5-3 4.6.1-2.5-1.1-4.4-2.6-5.8C7.9 9.5 5.8 11.6 5.8 15A6.2 6.2 0 0 0 12.4 21Z" />
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M3 9.5h18" />
      <path d="M8 2.5v4" />
      <path d="M16 2.5v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  doc: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.4 12.4l2.3 2.3 4.9-5.1" />
    </>
  ),
  folder: (
    <path d="M4 7.5a2 2 0 0 1 2-2h2.7l2 2H18a2 2 0 0 1 2 2V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
  ),
  warn: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </>
  ),
  arrowDown: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8" />
      <path d="M8.6 12.6 12 16l3.4-3.4" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />,
  bulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M8.2 14.8a6 6 0 1 1 7.6 0c-.8.6-1.2 1.3-1.2 2.2H9.4c0-.9-.4-1.6-1.2-2.2Z" />
    </>
  ),
  repeat: (
    <>
      <path d="M17 2.8 20.2 6 17 9.2" />
      <path d="M4 11V9a3 3 0 0 1 3-3h13" />
      <path d="m7 21.2-3.2-3.2L7 14.8" />
      <path d="M20 13v2a3 3 0 0 1-3 3H4" />
    </>
  ),
  hospital: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </>
  ),
  package: (
    <>
      <path d="m4 7.5 8-4 8 4-8 4z" />
      <path d="M4 7.5v9l8 4 8-4v-9" />
      <path d="M12 11.5v9" />
    </>
  ),
  pencil: (
    <>
      <path d="m4 16.8-.8 4 4-.8L19 8.2 15.8 5z" />
      <path d="m14.5 6.3 3.2 3.2" />
    </>
  ),
  handshake: (
    <>
      <path d="m7.5 13.5 2.2 2.2a2 2 0 0 0 2.8 0l.5-.5" />
      <path d="m10.5 10.5 1.8-1.8a2.4 2.4 0 0 1 3.4 0l3.1 3.1" />
      <path d="m5.2 9.8 3.6-3.2 3.2 2.7" />
      <path d="m3.5 11.5 5 5" />
      <path d="m20.5 11.5-5 5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  chevronRight: <path d="m9 5 7 7-7 7" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  bars: (
    <>
      <path d="M5 20V10" />
      <path d="M12 20V4" />
      <path d="M19 20v-7" />
    </>
  ),
}

export default function Icon({ name, size = 20 }) {
  const body = PATHS[name]
  if (!body) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {body}
    </svg>
  )
}
