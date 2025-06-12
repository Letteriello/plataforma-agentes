// src/theme/theme.ts

// Definições de Espaçamento (exemplo)
export const spacing = {
  px: '1px',
  '0': '0',
  '1': '0.25rem', // 4px
  '2': '0.5rem',  // 8px
  '3': '0.75rem', // 12px
  '4': '1rem',    // 16px
  '5': '1.25rem', // 20px
  '6': '1.5rem',  // 24px
  '8': '2rem',    // 32px
  '10': '2.5rem', // 40px
  '12': '3rem',   // 48px
  '16': '4rem',   // 64px
  '20': '5rem',   // 80px
  '24': '6rem',   // 96px
  '32': '8rem',   // 128px
  '40': '10rem',  // 160px
  '48': '12rem',  // 192px
  '56': '14rem',  // 224px
  '64': '16rem',  // 256px
};

// Definições de Tamanho de Fonte (exemplo)
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1' }],
  '6xl': ['3.75rem', { lineHeight: '1' }],
  '7xl': ['4.5rem', { lineHeight: '1' }],
  '8xl': ['6rem', { lineHeight: '1' }],
  '9xl': ['8rem', { lineHeight: '1' }],
};

// Definições de Border Radius (exemplo)
export const borderRadius = {
  none: '0px',
  sm: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px (shadcn/ui default for 'md')
  md: '0.375rem', // 6px (shadcn/ui default for 'lg')
  lg: '0.5rem',   // 8px (shadcn/ui default for 'xl')
  xl: '0.75rem',  // 12px
  '2xl': '1rem',  // 16px
  '3xl': '1.5rem',// 24px
  full: '9999px',
};

// Definições de Sombras (exemplo)
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// TODO: Adicionar definições para cores semânticas (success, warning, destructive)
// e outras constantes de design conforme necessário.

const theme = {
  spacing,
  fontSize,
  borderRadius,
  boxShadow,
};

export default theme;
