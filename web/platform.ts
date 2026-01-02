/**
 * Platform detection utility for web
 * This helps determine if we're running on web platform
 */

export const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

