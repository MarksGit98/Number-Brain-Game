// Calculator font style constants
export const CALCULATOR_FONT = 'Digital-7-Mono';

// Fallback to monospace if custom font not loaded
export const getCalculatorFont = (fontLoaded: boolean = true): string => {
  if (fontLoaded) {
    return CALCULATOR_FONT;
  }
  // Fallback to system monospace fonts
  return 'monospace';
};

