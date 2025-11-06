import * as React from "react";

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M2 21h20" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M12 21V11" />
    <path d="M8 11h8" />
    <path d="M9 7V5.5a1.5 1.5 0 0 1 3 0V7" />
  </svg>
);
