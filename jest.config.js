module.exports = {
  verbose: true,
  testMatch: ["**/*.test.(js|ts|tsx|mdx)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "css"],
  transform: {
    "^.+\\.([j|t]sx?)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.mdx?$": "@storybook/addon-docs/jest-transform-mdx"
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  transformIgnorePatterns: ["node_modules/(?!react-syntax-highlighter)"]
};
