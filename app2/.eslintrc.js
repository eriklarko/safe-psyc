module.exports = {
  root: true,
  extends: '@react-native-community',
  ignorePatterns: [
    "*.test.js", // eslint is finding used variables unused and jest is being difficult
    "node_modules/",
  ],
  rules: {
    'prettier/prettier': 'off',
    'consistent-this': 'off',
    'eol-last': 'off',

    'semi': 'error',
    'jsx-quotes': ['error', 'prefer-single'],
  },
};
