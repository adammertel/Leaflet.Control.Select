module.exports = {
  stories: ["../demo/**/*.stories.mdx"],
  addons: [
    //"@storybook/addon-storysource",

    {
      name: "@storybook/addon-docs",
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null
      }
    }
  ]
};
