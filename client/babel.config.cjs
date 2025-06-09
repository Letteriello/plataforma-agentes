module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
  plugins: [
    // Ensures Babel can parse import.meta syntax
    '@babel/plugin-syntax-import-meta',
    // Transforms import.meta.env.VITE_... to process.env.VITE_...
    'babel-plugin-transform-import-meta',
  ],
};
