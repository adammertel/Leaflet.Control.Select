module.exports = {
  stories: ["../demo/**/*.stories.mdx"],
  framework: "html",
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        babelOptions: {},
        sourceLoaderOptions: null,
      },
    },
  ],
};
