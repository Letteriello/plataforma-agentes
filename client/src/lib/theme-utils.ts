import { theme } from '@/theme';

/**
 * Get a value from the theme by path
 * @param path Dot notation path to the theme value (e.g., 'colors.primary')
 * @param defaultValue Fallback value if the path doesn't exist
 * @returns The theme value or the default value
 */
export const getThemeValue = <T = any>(
  path: string,
  defaultValue?: T
): T => {
  // Split the path into parts and traverse the theme object
  const result = path.split('.').reduce((obj, key) => {
    return obj && obj[key as keyof typeof obj];
  }, theme as any);

  return result !== undefined ? result : defaultValue;
};

/**
 * Generate a CSS variable string for a theme value
 * @param path Dot notation path to the theme value
 * @param prefix CSS variable prefix (default: '--nexus')
 * @returns CSS variable string (e.g., 'var(--nexus-colors-primary)')
 */
export const themeVar = (path: string, prefix = '--nexus'): string => {
  return `var(${prefix}-${path.replace(/\./g, '-')})`;
};

/**
 * Generate a responsive style object based on breakpoints
 * @param values Object with breakpoint keys and style values
 * @param property CSS property to apply the values to
 * @returns Responsive style object
 */
export const responsiveStyle = <T = any>(
  values: Record<string, T>,
  property: string
): Record<string, any> => {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };

  const result: Record<string, any> = {};
  
  // Add base styles (if 'base' is provided)
  if ('base' in values) {
    result[property] = values.base;
  }

  // Add responsive styles
  Object.entries(values).forEach(([key, value]) => {
    if (key !== 'base' && key in breakpoints) {
      result[`@media (min-width: ${breakpoints[key as keyof typeof breakpoints]})`] = {
        [property]: value,
      };
    }
  });

  return result;
};

/**
 * Generate a consistent shadow style based on elevation level
 * @param level Elevation level (0-5)
 * @returns Box shadow value
 */
export const elevation = (level: 0 | 1 | 2 | 3 | 4 | 5 = 0): string => {
  const shadows = [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  ];

  return shadows[Math.min(level, 5)];
};
