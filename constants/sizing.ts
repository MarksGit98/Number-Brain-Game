import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base scaling factors
const SCALE_WIDTH = SCREEN_WIDTH / 375; // Base width (iPhone X)
const SCALE_HEIGHT = SCREEN_HEIGHT / 812; // Base height (iPhone X)

// Use the smaller scale factor to maintain aspect ratio
const SCALE = Math.min(SCALE_WIDTH, SCALE_HEIGHT);

// Font sizes (percentage of screen height)
export const FONT_SIZES = {
  TITLE: SCREEN_HEIGHT * 0.037, // ~30px on base
  PLAY_BUTTON: SCREEN_HEIGHT * 0.108, // ~88px on base
  TARGET_NUMBER: SCREEN_HEIGHT * 0.163, // ~132px on base (increased 10% from 120px)
  DIFFICULTY_BUTTON: SCREEN_HEIGHT * 0.022, // ~18px on base
  DIFFICULTY_SUBTEXT: SCREEN_HEIGHT * 0.015, // ~12px on base
  HISTORY_TITLE: SCREEN_HEIGHT * 0.020, // ~16px on base
  HISTORY_TEXT: SCREEN_HEIGHT * 0.017, // ~14px on base
  LEVEL_NUMBER: SCREEN_HEIGHT * 0.025, // ~20px on base
  BUTTON_TEXT: SCREEN_HEIGHT * 0.022, // ~18px on base
  OPERATION_SYMBOL: SCREEN_HEIGHT * 0.049, // ~40px on base
  DIGIT_TEXT: SCREEN_HEIGHT * 0.048, // ~39px on base (increased 12% from ~35px)
  SUCCESS_BANNER: SCREEN_HEIGHT * 0.059, // ~48px on base
};

// Spacing (percentage of screen dimensions)
export const SPACING = {
  // Margins
  MARGIN_SMALL: SCREEN_HEIGHT * 0.012, // ~10px
  MARGIN_MEDIUM: SCREEN_HEIGHT * 0.025, // ~20px
  MARGIN_LARGE: SCREEN_HEIGHT * 0.037, // ~30px
  MARGIN_XLARGE: SCREEN_HEIGHT * 0.062, // ~50px
  // Level library tile spacing - calculated to fit exactly 3 tiles per row
  // Each tile has margin on all sides, so we need 6 margins total (2 per button) for 3 buttons
  LEVEL_TILE_MARGIN: SCREEN_WIDTH * 0.054, // ~20px on base, calculated to fit 3 tiles per row
  
  // Padding
  PADDING_SMALL: SCREEN_HEIGHT * 0.012, // ~10px
  PADDING_MEDIUM: SCREEN_HEIGHT * 0.015, // ~12px
  PADDING_LARGE: SCREEN_HEIGHT * 0.025, // ~20px
  PADDING_XLARGE: SCREEN_HEIGHT * 0.037, // ~30px
  
  // Container padding
  CONTAINER_PADDING_HORIZONTAL: SCREEN_WIDTH * 0.053, // ~20px on base
  CONTAINER_PADDING_TOP: SCREEN_HEIGHT * 0.062, // ~50px on base
};

// Button sizes (percentage of screen dimensions)
export const BUTTON_SIZES = {
  // Play button
  PLAY_BUTTON_WIDTH: SCREEN_WIDTH * 0.747, // ~280px on base
  PLAY_BUTTON_HEIGHT: SCREEN_HEIGHT * 0.123, // ~100px on base
  
  // Difficulty buttons
  DIFFICULTY_BUTTON_WIDTH: SCREEN_WIDTH * 0.533, // ~200px on base
  DIFFICULTY_BUTTON_PADDING_VERTICAL: SCREEN_HEIGHT * 0.015, // ~12px
  DIFFICULTY_BUTTON_PADDING_HORIZONTAL: SCREEN_WIDTH * 0.053, // ~20px
  DIFFICULTY_BUTTON_MARGIN_BOTTOM: SCREEN_HEIGHT * 0.015, // ~12px
  
  // Digit buttons - sized to fit 4 tiles on one line
  // 4 tiles + 3 margins = ~92% of screen width, leaving room for padding
  DIGIT_BUTTON_SIZE: SCREEN_WIDTH * 0.171, // ~64px on base (reduced by 10% from 0.19)
  DIGIT_BUTTON_MARGIN: SCREEN_WIDTH * 0.015, // ~6px on base (reduced from 8px)
  
  // Operation buttons - smaller and circular (reduced by 5% to fit with undo button)
  OPERATION_BUTTON_SIZE: SCREEN_WIDTH * 0.1425, // ~53px on base (reduced by 5% from 0.15)
  OPERATION_BUTTON_MARGIN: SCREEN_WIDTH * 0.021, // ~8px on base
  
  // Navigation arrows
  NAV_ARROW_SIZE: SCREEN_WIDTH * 0.1197, // ~45px on base (reduced by 10% from 0.133)
  NAV_ARROW_BOTTOM: SCREEN_HEIGHT * 0.025, // ~20px
  NAV_ARROW_HORIZONTAL: SCREEN_WIDTH * 0.053, // ~20px
};

// Calculator/Target display
export const CALCULATOR_DISPLAY = {
  WIDTH: SCREEN_WIDTH * 0.8, // ~280px on base
  HEIGHT: SCREEN_HEIGHT * 0.18, // ~80px on base
  PADDING_HORIZONTAL: SCREEN_WIDTH * 0.05, // ~40px on base
  PADDING_VERTICAL: SCREEN_HEIGHT * 0.015, // ~12px
  BORDER_RADIUS: SCREEN_HEIGHT * 0.010, // ~8px
  SHADOW_OFFSET: SCREEN_WIDTH * 0.011, // ~4px
};

// History box
export const HISTORY_BOX = {
  WIDTH: SCREEN_WIDTH * .92, // Full width with padding
  MAX_WIDTH: SCREEN_WIDTH * 1.013, // ~380px on base
  PADDING: SCREEN_HEIGHT * 0.017, // ~14px - equal top and bottom padding
  BORDER_RADIUS: SCREEN_HEIGHT * 0.020, // ~16px
  // Height calculation for one history bar (no title)
  // One line = padding top + bar (padding + text + padding) + padding bottom
  // Text font size is 1.06x the base, so line height accounts for this
  HEIGHT_ONE_LINE: (SCREEN_HEIGHT * 0.017) + // Padding top
                   (SCREEN_HEIGHT * 0.012 * 2) + // Bar padding vertical (top + bottom) - increased
                   (SCREEN_HEIGHT * 0.017 * 1.06) + // History text font size * 1.06 (actual line height)
                   (SCREEN_HEIGHT * 0.017), // Padding bottom
  // Height per additional bar = bar padding + text + margin bottom
  BAR_HEIGHT: (SCREEN_HEIGHT * 0.012 * 2) + // Bar padding vertical (top + bottom) - increased
              (SCREEN_HEIGHT * 0.017 * 1.06) + // History text font size * 1.06 (actual line height)
              SCREEN_HEIGHT * 0.007, // Bar margin bottom
  BAR_PADDING_HORIZONTAL: SCREEN_WIDTH * 0.032, // ~12px
  BAR_PADDING_VERTICAL: SCREEN_HEIGHT * 0.012, // ~10px (increased to prevent text cutoff)
  BAR_MARGIN_BOTTOM: SCREEN_HEIGHT * 0.007, // ~6px
  BAR_BORDER_RADIUS: SCREEN_HEIGHT * 0.007, // ~6px
  // Max height for wrapper (hard difficulty with 5 entries)
  HEIGHT_HARD: SCREEN_HEIGHT * 0.286, // ~232px
};

// Border radius
export const BORDER_RADIUS = {
  SMALL: SCREEN_HEIGHT * 0.007, // ~6px
  MEDIUM: SCREEN_HEIGHT * 0.010, // ~8px
  LARGE: SCREEN_HEIGHT * 0.015, // ~12px
  XLARGE: SCREEN_HEIGHT * 0.022, // ~18px
  CIRCULAR: SCREEN_WIDTH * 0.5, // For circular buttons
};

// Letter spacing
export const LETTER_SPACING = {
  TIGHT: SCREEN_WIDTH * 0.003, // ~1px
  NORMAL: SCREEN_WIDTH * 0.005, // ~2px
  WIDE: SCREEN_WIDTH * 0.011, // ~4px
  EXTRA_WIDE: SCREEN_WIDTH * 0.011, // ~4px (for PLAY button)
};

// Shadow offsets
export const SHADOW = {
  OFFSET_SMALL: { width: SCREEN_WIDTH * 0.005, height: SCREEN_HEIGHT * 0.002 }, // ~2px
  OFFSET_MEDIUM: { width: SCREEN_WIDTH * 0.011, height: SCREEN_HEIGHT * 0.005 }, // ~4px
  OFFSET_LARGE: { width: SCREEN_WIDTH * 0.016, height: SCREEN_HEIGHT * 0.007 }, // ~6px
  RADIUS_SMALL: SCREEN_HEIGHT * 0.002, // ~2px
  RADIUS_MEDIUM: SCREEN_HEIGHT * 0.005, // ~4px
  RADIUS_LARGE: SCREEN_HEIGHT * 0.010, // ~8px
  RADIUS_CIRCULAR_BUTTON: SCREEN_HEIGHT * 0.001, // ~1.8px (reduced by 10% from ~2px)
  OPACITY_LIGHT: 0.1,
  OPACITY_MEDIUM: 0.3,
  OPACITY_FULL: 1.0,
};

// Inset shadow (for pressed buttons)
export const INSET_SHADOW = {
  BORDER_WIDTH: SCREEN_WIDTH * 0.005, // ~2px
  RADIUS: SCREEN_HEIGHT * 0.004, // ~3px
  BORDER_WIDTH_THICK: SCREEN_WIDTH * 0.008, // ~3px (thicker for difficulty buttons)
};

// Button borders
export const BUTTON_BORDER = {
  WIDTH: SCREEN_WIDTH * 0.003, // ~1px - thin black border
  COLOR: '#000',
};

// Level positioning
export const LEVEL_POSITION = {
  MARGIN_TOP: SCREEN_HEIGHT * -0.123, // -10% of screen height
  MARGIN_BOTTOM: SCREEN_HEIGHT * 0.123, // 10% of screen height
  TARGET_MARGIN_TOP: SCREEN_HEIGHT * -0.074, // -60px equivalent
  TARGET_MARGIN_BOTTOM: SCREEN_HEIGHT * 0.025, // Reduced from 50px to 20px
};

// Digit buttons container positioning (fixed position from top)
export const DIGIT_CONTAINER_POSITION = {
  TOP: SCREEN_HEIGHT * 0.45, // 45% from top of screen
};

// Controls container
export const CONTROLS = {
  MARGIN_TOP: SCREEN_HEIGHT * 0.037, // ~30px
  MARGIN_BOTTOM: SCREEN_HEIGHT * 0.025, // ~20px
  BUTTON_MARGIN_RIGHT: SCREEN_WIDTH * 0.032, // ~12px
};

// Animation values
export const ANIMATION = {
  // Scale values for button press animations
  SCALE_PRESSED: 0.92, // Scale when button is pressed down
  SCALE_PRESSED_LIGHT: 0.95, // Lighter press scale (for cards, play button)
  SCALE_PRESSED_TAB: 0.98, // Very light press scale (for tabs)
  SCALE_NORMAL: 1, // Normal scale (unpressed)
  
  // TranslateX values for button press animations (moving toward shadow position - right)
  TRANSLATE_X_PRESSED: 4, // Pixels to move right when pressed (matches shadow offset)
  TRANSLATE_X_PRESSED_LIGHT: 2, // Lighter press movement
  TRANSLATE_X_PRESSED_TAB: 1, // Very light press movement
  TRANSLATE_X_PRESSED_PLAY: 4, // Play button press movement
  TRANSLATE_X_NORMAL: 0, // Normal position (unpressed)
  TRANSLATE_X_SELECTED: 4, // Position when button is selected (matches shadow offset)
  
  // TranslateY values for button press animations (moving toward shadow position - down)
  TRANSLATE_Y_PRESSED: 4, // Pixels to move down when pressed (matches shadow offset)
  TRANSLATE_Y_PRESSED_LIGHT: 2, // Lighter press movement
  TRANSLATE_Y_PRESSED_TAB: 1, // Very light press movement
  TRANSLATE_Y_PRESSED_PLAY: 4, // Play button press movement
  TRANSLATE_Y_NORMAL: 0, // Normal position (unpressed)
  TRANSLATE_Y_SELECTED: 4, // Position when button is selected (matches shadow offset)
  
  // Animation timing
  DURATION_FAST: 100, // Milliseconds for fast animations
  TENSION: 300, // Spring tension value
  FRICTION: 10, // Spring friction value
  
  // Opacity values
  OPACITY_FULL: 1, // Fully opaque
  OPACITY_HIDDEN: 0, // Fully transparent
  OPACITY_DISABLED: 0.5, // Disabled state opacity
  OPACITY_SUBTEXT: 0.9, // Subtext opacity
  OPACITY_SHADOW_LIGHT: 0.1, // Light shadow opacity
  OPACITY_SHADOW_MEDIUM: 0.3, // Medium shadow opacity
  OPACITY_SHADOW_FULL: 0.5, // Full shadow opacity
  
  // Interpolation ranges
  INTERPOLATION_INPUT: [0, 1], // Input range for interpolation
  INTERPOLATION_OUTPUT: [0, 1], // Output range for interpolation
};

// Colors
export const COLORS = {
  // Background colors
  BACKGROUND_LIGHT: '#f8f9fa', // Light gray background
  BACKGROUND_WHITE: '#fff', // White background
  BACKGROUND_DARK: '#2C2C2C', // Dark gray (calculator display)
  BACKGROUND_DISABLED: '#E0E0E0', // Light gray for disabled buttons
  BACKGROUND_DISABLED_DARK: '#B0B0B0', // Darker gray for disabled undo button
  
  // Button colors
  BUTTON_BLUE: '#2196F3', // Primary blue button
  BUTTON_BLUE_DARK: '#1976D2', // Darker blue (selected state)
  BUTTON_BLUE_DARKER: '#0D47A1', // Even darker blue
  BUTTON_BLUE_LIGHT: '#25, 118, 210', // Light blue (for overlays)
  BUTTON_BLUE_DARKEST: '#13, 71, 161', // Darkest blue (for press overlays)
  
  // Digit button colors
  DIGIT_FIRST_SELECTED: '#2196F3', // Blue for first selected digit
  DIGIT_SECOND_SELECTED: '#F44336', // Red for second selected digit
  DIGIT_ERROR: '#D32F2F', // Darker red for error state
  
  // Difficulty colors
  DIFFICULTY_EASY: '#4CAF50', // Green for easy
  DIFFICULTY_EASY_DARK: '#388E3C', // Dark green shadow
  DIFFICULTY_MEDIUM: '#FF9800', // Orange for medium
  DIFFICULTY_MEDIUM_DARK: '#F57C00', // Dark orange shadow
  DIFFICULTY_HARD: '#F44336', // Red for hard
  DIFFICULTY_HARD_DARK: '#D32F2F', // Dark red shadow
  
  // Text colors
  TEXT_PRIMARY: '#2c3e50', // Dark gray text
  TEXT_SECONDARY: '#333', // Medium gray text
  TEXT_TERTIARY: '#666', // Light gray text
  TEXT_WHITE: '#fff', // White text
  TEXT_DISABLED: '#9E9E9E', // Gray for disabled text
  TEXT_SUCCESS: '#4CAF50', // Green text (target number, success)
  
  // Shadow colors
  SHADOW_BLACK: '#000', // Black shadow
  
  // Border colors
  BORDER_TRANSPARENT: 'transparent', // Transparent border
  BORDER_LIGHT: '#E0E0E0', // Light gray border
  BORDER_DARK: 'rgba(0, 0, 0, 0.4)', // Dark border with opacity
  
  // Overlay colors (rgba format)
  OVERLAY_BLUE_LIGHT: 'rgba(80, 108, 230, 0.15)', // Light blue overlay (selected)
  OVERLAY_BLUE_DARK: 'rgba(33, 150, 243, 0.35)', // Dark blue overlay (pressed)
  OVERLAY_BLUE_DARKER: 'rgba(68, 99, 235, 0.6)', // Much darker blue overlay (pressed down animation)
  OVERLAY_RED_LIGHT: 'rgba(244, 67, 54, 0.15)', // Light red overlay (selected)
  OVERLAY_RED_DARKER: 'rgba(183, 28, 28, 0.6)', // Much darker red overlay (pressed down animation)
  OVERLAY_GREEN: 'rgba(76, 175, 80, 0.3)', // Green overlay
  OVERLAY_ORANGE: 'rgba(255, 152, 0, 0.3)', // Orange overlay
  OVERLAY_RED: 'rgba(244, 67, 54, 0.3)', // Red overlay
  // Operation button colors (orange - darker hue, less red)
  BUTTON_ORANGE: '#F57C00', // Darker orange for operation buttons (less red, more orange)
  BUTTON_ORANGE_DARK: '#E65100', // Darker orange (selected state)
  OVERLAY_ORANGE_OPERATION_SELECTED: 'rgba(245, 124, 0, 0.15)', // Orange overlay for selected operation
  OVERLAY_ORANGE_OPERATION_PRESSED: 'rgba(230, 81, 0, 0.35)', // Darker orange overlay for pressed operation
};

// Shadow offsets (specific pixel values)
export const SHADOW_OFFSETS = {
  // Standard shadow offsets
  STANDARD: { width: SCREEN_WIDTH * 0.011, height: SCREEN_HEIGHT * 0.005 }, // ~4px, ~4px
  STANDARD_ALT: { width: 4, height: 4 }, // 4px, 4px (for digit/operation buttons)
  CIRCULAR: { width: 2.7, height: 2.7 }, // ~2.7px, ~2.7px (reduced by 10% from 3.0)
  DIFFICULTY: { width: 4.4, height: 4.4 }, // ~4.4px, ~4.4px (10% larger for difficulty buttons - more depth)
  ZERO: { width: 0, height: 0 }, // No offset (for inset shadows)
  VERTICAL_SMALL: { width: 0, height: 2 }, // Small vertical shadow
  VERTICAL_MEDIUM: { width: 0, height: 4 }, // Medium vertical shadow
};

// Border radius adjustments
export const BORDER_RADIUS_ADJUSTMENTS = {
  INSET_SHADOW_OFFSET: 1, // Subtract from border radius for inset shadow
};

// Percentage strings
export const PERCENTAGES = {
  FULL: '100%', // Full width/height
  THIRD: '33.33%', // One third width
  ONE_POINT_FIVE: '1.5%', // Small margin percentage
};

// Font weights
export const FONT_WEIGHTS = {
  NORMAL: 'normal', // Normal font weight
  BOLD: 'bold', // Bold font weight
  SEMI_BOLD: '600', // Semi-bold (600)
  EXTRA_BOLD: '900', // Extra bold (900)
};

// Elevation values (Android)
export const ELEVATION = {
  NONE: 0, // No elevation
  SMALL: 2, // Small elevation
  MEDIUM: 4, // Medium elevation
  LARGE: 8, // Large elevation
};

// Padding values (specific pixel values)
export const PADDING_VALUES = {
  ZERO: 0, // No padding
  TAB_VERTICAL: 12, // Tab button vertical padding
  TAB_BORDER: 3, // Tab border width
  TAB_MARGIN_BOTTOM: -2, // Tab margin bottom adjustment
};

// Other numeric constants
export const NUMERIC_CONSTANTS = {
  // Multipliers
  FONT_MULTIPLIER_FULL: 1.0, // Full size multiplier
  FONT_MULTIPLIER_TAB: 0.78, // Tab text size multiplier
  FONT_MULTIPLIER_NAV_ARROW: 1.404, // Navigation arrow text multiplier (reduced by 10% from 1.56)
  FONT_MULTIPLIER_TITLE: 0.93, // Title size multiplier
  
  // Division values
  DIVIDE_BY_2: 2, // For circular border radius calculations
  
  // Position values (for absolute positioning)
  POSITION_TOP: 0, // Top position
  POSITION_LEFT: 0, // Left position
  POSITION_RIGHT: 0, // Right position
  POSITION_BOTTOM: 0, // Bottom position
  
  // Opacity values
  OPACITY_FULL: 1, // Full opacity
  OPACITY_HALF: 0.5, // Half opacity
  OPACITY_NINETY: 0.9, // 90% opacity
  
  // Spacing divisions
  SPACING_DIVISION_6: 6, // For subtext margin calculation
};

// Export screen dimensions for direct use
export const SCREEN_DIMENSIONS = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT,
  SCALE,
};

