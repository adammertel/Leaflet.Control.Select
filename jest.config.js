module.exports = {
  verbose: true,
  testMatch: ["**/*.test.js"],
  moduleFileExtensions: ["js", "json"],
  transform: {
    "^.+\\.([js?)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.mdx?$": "@storybook/addon-docs/jest-transform-mdx"
  }
};
