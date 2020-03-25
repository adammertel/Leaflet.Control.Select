module.exports = {
  stories: ["../demo/**/*.stories.mdx"],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        babelOptions: {},
        sourceLoaderOptions: null
      }
    }
  ]
};
