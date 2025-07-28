module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Temporarily disable unused variables warnings for development
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  }
};