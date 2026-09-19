export type IconName = keyof typeof paths

const paths = {
  cart: 'M3 4h2.2l2.1 10.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 7H6.2M10 20.5h.01M17 20.5h.01',
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM21 21l-4.3-4.3',
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'M5 5l14 14M19 5L5 19',
  star: 'M12 3.2l2.6 5.6 6 .8-4.4 4.2 1.1 6.1-5.3-2.9-5.3 2.9L7.8 13.8 3.4 9.6l6-.8L12 3.2Z',
  arrowRight: 'M4 12h15M13 6l6 6-6 6',
  arrowLeft: 'M20 12H5M11 18l-6-6 6-6',
  chevronDown: 'M5 8.5l7 7 7-7',
  chevronRight: 'M8.5 5l7 7-7 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M4 7h16M9.5 7V4.8h5V7M6.5 7l.9 12.2a1.8 1.8 0 0 0 1.8 1.6h5.6a1.8 1.8 0 0 0 1.8-1.6L17.5 7M10 11v6M14 11v6',
  check: 'M4.5 12.5l5 5 10-11',
  bolt: 'M13.5 2.5L4 14h6.5L10.5 21.5 20 10h-6.5l0-7.5Z',
  grid: 'M4 4h6.5v6.5H4V4ZM13.5 4H20v6.5h-6.5V4ZM4 13.5h6.5V20H4v-6.5ZM13.5 13.5H20V20h-6.5v-6.5Z',
  list: 'M4 6h16M4 12h16M4 18h16',
  filter: 'M3.5 5h17l-6.6 7.8V20l-3.8-2.4v-4.8L3.5 5Z',
  tag: 'M3.5 11.4V4.5a1 1 0 0 1 1-1h6.9a1 1 0 0 1 .7.3l8.1 8.1a1 1 0 0 1 0 1.4l-6.9 6.9a1 1 0 0 1-1.4 0L3.8 12.1a1 1 0 0 1-.3-.7ZM8 8h.01',
  user: 'M4.5 20.5a7.5 7.5 0 0 1 15 0M12 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z',
  play: 'M7 4.5l12 7.5-12 7.5v-15Z',
  shield: 'M12 2.8l7.5 3v6c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5v-6l7.5-3Z',
  chip: 'M7.5 7.5h9v9h-9v-9ZM10 3.5v4M14 3.5v4M10 16.5v4M14 16.5v4M3.5 10h4M3.5 14h4M16.5 10h4M16.5 14h4',
  coins: 'M12 8.5c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3ZM4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z',
  library: 'M4 4h4v16H4V4ZM10 4h4v16h-4V4ZM16.2 5.2l3.6 1-4 14.2-3.6-1',
  external: 'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10',
  clock: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM12 7v5.2l3.4 2',
  flame: 'M12 2.5c3.5 4 5.5 6.5 5.5 9.5a5.5 5.5 0 0 1-11 0c0-1.4.5-2.6 1.4-3.9.6 1.4 1.5 2 2.4 2 0-2.6.5-5 1.7-7.6Z',
  globe: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM3.2 9h17.6M3.2 15h17.6M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3Z',
  cpu: 'M9 9h6v6H9V9ZM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  send: 'M21.5 2.5L11 13M21.5 2.5l-6.7 19-3.8-8.5L2.5 9.2l19-6.7Z',
} as const

interface Props {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
  style?: React.CSSProperties
  filled?: boolean
}

export default function Icon({ name, size = 18, className, strokeWidth = 1.7, style, filled }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}
