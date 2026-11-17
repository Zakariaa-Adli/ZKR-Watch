const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

function Svg({ children, size, ...props }) {
  return (
    <svg {...base} width={size ?? base.width} height={size ?? base.height} {...props}>
      {children}
    </svg>
  );
}

export function PlayIcon(props) {
  return (
    <Svg {...props}>
      <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function PauseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M8 5v14M16 5v14" strokeWidth="2.4" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </Svg>
  );
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Svg>
  );
}

export function BookmarkIcon({ filled = false, ...props }) {
  return (
    <Svg {...props} fill={filled ? "currentColor" : "none"}>
      <path d="M6.5 4.5h11v15l-5.5-3.8-5.5 3.8z" />
    </Svg>
  );
}

export function StarIcon({ filled = true, ...props }) {
  return (
    <Svg {...props} fill={filled ? "currentColor" : "none"} strokeWidth={filled ? 0 : 1.6}>
      <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.8-5.3-2.9-5.3 2.9 1.1-5.8L3.5 9.8l5.9-.8z" />
    </Svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <Svg {...props}>
      <path d="m14.5 5-7 7 7 7" />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="m9.5 5 7 7-7 7" />
    </Svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="m5 9 7 7 7-7" />
    </Svg>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Svg>
  );
}

export function HomeIcon(props) {
  return (
    <Svg {...props}>
      <path d="m4 10 8-6.5 8 6.5v9.5H4z" />
      <path d="M9.5 19v-5h5v5" />
    </Svg>
  );
}

export function FilmIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M8 4.5v15M16 4.5v15M3.5 9h4.5M3.5 15h4.5M16 9h4.5M16 15h4.5" />
    </Svg>
  );
}

export function TvIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="6.5" width="18" height="12" rx="2" />
      <path d="m8 3 4 3.5L16 3" />
    </Svg>
  );
}

export function CompassIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </Svg>
  );
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

export function EyeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </Svg>
  );
}

export function TrashIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4.5 7h15M9 7V4.5h6V7M6.5 7l.8 12h9.4l.8-12M10 10.5v5M14 10.5v5" />
    </Svg>
  );
}

export function ExternalIcon(props) {
  return (
    <Svg {...props}>
      <path d="M13.5 4.5H19.5V10.5M19.5 4.5 11 13" />
      <path d="M18 14.5v4H5.5v-12h4" />
    </Svg>
  );
}

export function SparkIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5c.4 4.7 2.8 7.1 7.5 7.5-4.7.4-7.1 2.8-7.5 7.5-.4-4.7-2.8-7.1-7.5-7.5 4.7-.4 7.1-2.8 7.5-7.5Z" />
    </Svg>
  );
}

export function ShuffleIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 7h3.2c4.8 0 5.8 10 10.6 10h3.2M17.5 14l3 3-3 3M3.5 17h3.2c2 0 3.3-1.7 4.6-3.9M14.5 8.5C15.5 7.6 16.3 7 17.3 7h3.2M17.5 4l3 3-3 3" />
    </Svg>
  );
}

export function FilterIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 6h17M6.5 12h11M9.5 18h5" />
    </Svg>
  );
}

export function InfoIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </Svg>
  );
}

export function GridIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </Svg>
  );
}

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="62" height="62" rx="14" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M18 20h28L22 44h24" fill="none" stroke="currentColor" strokeWidth="4.5" />
      <circle cx="46" cy="20" r="3" fill="var(--accent)" />
    </svg>
  );
}
