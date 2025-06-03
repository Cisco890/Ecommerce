// .storybook/main.js
module.exports = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  stories: ["../src/stories/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
}
