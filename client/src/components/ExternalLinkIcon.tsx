/**
 * External Link SVG Icon
 * 
 * Lightweight SVG replacement for Lucide React ExternalLink icon.
 * Test case for validating icon replacement pattern.
 */

interface IconProps {
  className?: string;
  size?: number;
}

export function ExternalLinkIcon({ className = "", size = 24 }: IconProps) {
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
      className={className}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2h6" />
    </svg>
  );
}