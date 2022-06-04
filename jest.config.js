module.exports = {
  verbose: true,
  //testMatch: ["**/*.test.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "css"],
  transform: {
    "^.+\\.mdx?$": "@storybook/addon-docs/jest-transform-mdx",
    //    "^.+\\.([j|t]sx?)$": "<rootDir>/node_modules/babel-jest",
    //"^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  modulePathIgnorePatterns: ["/node_modules/@storybook"],
};
