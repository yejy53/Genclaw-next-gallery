type IconProps = {
  size?: number;
  className?: string;
};

function base(size: number, className?: string) {
  return {
    "aria-hidden": "true" as const,
    className,
    fill: "none" as const,
    height: size,
    viewBox: "0 0 24 24",
    width: size,
  };
}

export function HomeIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m14.8 9.2-1.5 4.1-4.1 1.5 1.5-4.1z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function GalleryIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="18"
        x="3"
        y="5"
      />
      <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m4 17 4.3-4 3.4 3 3-2.6L21 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function WebIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3.6 12h16.8M12 3.6c2.4 2.2 3.6 5.2 3.6 8.4S14.4 18.2 12 20.4C9.6 18.2 8.4 15.2 8.4 12S9.6 5.8 12 3.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function PosterIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect
        height="17"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.4"
        width="13"
        x="5.5"
        y="3.5"
      />
      <path
        d="M9 8.5h6M9 12h6M9 15.5h3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function SlideIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
        width="17"
        x="3.5"
        y="5"
      />
      <path
        d="M12 17v3M9 20h6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function InfographicIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path
        d="M5 19V9M12 19V5M19 19v-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path d="M3.5 19h17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function categoryIcon(
  id: "web" | "poster" | "slide" | "infographic",
  size = 15
) {
  switch (id) {
    case "web":
      return <WebIcon size={size} />;
    case "poster":
      return <PosterIcon size={size} />;
    case "slide":
      return <SlideIcon size={size} />;
    case "infographic":
      return <InfographicIcon size={size} />;
  }
}

export function GridIcon({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="4" y="4" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="14" y="4" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="4" y="14" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.5" width="6" x="14" y="14" />
    </svg>
  );
}

export function ArrowUpRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ChevronRightIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function MenuIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

export function SearchIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

export function ExpandIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path
        d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function RefreshIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path
        d="M20 11a8 8 0 1 0-.9 4.5M20 5v6h-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
