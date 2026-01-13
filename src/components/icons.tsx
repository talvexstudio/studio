import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="18" height="18" x="3" y="3" rx="4" ry="4" fill="url(#logoGradient)" stroke="none" />
      <path d="M7 12h2v5H7z" fill="hsla(var(--primary-foreground) / 0.8)" />
      <path d="M11 7h2v10h-2z" fill="hsla(var(--primary-foreground) / 0.8)" />
      <path d="M15 10h2v7h-2z" fill="hsla(var(--primary-foreground) / 0.8)" />
    </svg>
  );
}
