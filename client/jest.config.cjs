module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  clearMocks: true,
  transform: {
    // Use ts-jest for .ts and .tsx files, and tell it to use Babel
    '^.+\\.tsx?$': ['ts-jest', { babelConfig: true }],
    // Use babel-jest for .js and .jsx files (including those in node_modules that need transformation)
    '^.+\\.jsx?$': 'babel-jest',
  },
  // This pattern tells Jest to NOT ignore react-resizable-panels for transformation.
  // All other files in node_modules will be ignored by default.
  transformIgnorePatterns: [
    '/node_modules/(?!react-resizable-panels).+\\.js$', // More specific to JS files for react-resizable-panels
    // If react-resizable-panels also includes .jsx or other extensions, adjust accordingly or use a broader pattern:
    // '/node_modules/(?!react-resizable-panels/)', // This would attempt to transform any file type from this package
  ],
};
