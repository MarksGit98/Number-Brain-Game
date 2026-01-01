/**
 * Font configuration for Digital-7 Mono
 * 
 * IMPORTANT: Digital-7 Mono font doesn't support fontWeight variations.
 * The fontWeight property has no effect with this font.
 * 
 * Solutions:
 * 1. Use text shadow to simulate bold (current approach)
 * 2. Download and use a bold variant font file if available
 */

export const FONTS = {
  // Regular Digital-7 Mono
  DIGITAL_REGULAR: 'Digital-7-Mono',
  
  // Bold variant (if you add digital-7-mono-bold.ttf, register it in App.tsx)
  // Check: https://www.dafont.com/digital-7.font for bold variant
  DIGITAL_BOLD: 'Digital-7-Mono-Bold', // Use this if bold variant is available
} as const;

/**
 * Text shadow styles to make Digital-7 Mono appear bolder
 * Since the font doesn't support fontWeight, we use text shadow as a workaround
 */

// Light bold effect - subtle shadow
export const TEXT_SHADOW_BOLD = {
  textShadowColor: '#000',
  textShadowOffset: { width: 0.5, height: 0.5 },
  textShadowRadius: 0,
  textShadowOpacity: 0.8,
};

// Medium bold effect - more visible
export const TEXT_SHADOW_BOLD_MEDIUM = {
  textShadowColor: '#000',
  textShadowOffset: { width: 0.8, height: 0.8 },
  textShadowRadius: 0.5,
  textShadowOpacity: 0.9,
};

// Strong bold effect - very visible
export const TEXT_SHADOW_BOLD_STRONG = {
  textShadowColor: '#000',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
  textShadowOpacity: 1,
};

// Extra strong bold effect - maximum bold appearance
export const TEXT_SHADOW_BOLD_EXTRA = {
  textShadowColor: '#000',
  textShadowOffset: { width: 1.2, height: 1.2 },
  textShadowRadius: 1.5,
  textShadowOpacity: 1,
};

