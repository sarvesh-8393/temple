import * as React from "react";

export const OmIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M15.58 10.5A2.5 2.5 0 0 1 15.5 5H14a3.5 3.5 0 0 0-3.5 3.5V12a3.5 3.5 0 0 0 3.5 3.5h.5a2.5 2.5 0 0 0 2.5-2.5" />
    <path d="M12 12a2.5 2.5 0 0 0-2.5-2.5H8.25a2.5 2.5 0 1 0 0 5H10" />
    <path d="M17.5 10.5c.621 0 1.14.434 1.235 1.022" />
  </svg>
);

export const DiyaIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 16h16" />
    <path d="M8 16c0-4 4-6 4-6s4 2 4 6" />
    <path d="M12 8V6" />
    <path d="M7 16c-1.5-1-2-2.5-2-4" />
    <path d="M17 16c1.5-1 2-2.5 2-4" />
  </svg>
);
