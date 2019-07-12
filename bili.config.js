module.exports = {
  presets: ['bili/babel'],
  output: {
    moduleName: 'optiImage',
    extractCSS: false,
  },
  plugins: {
    vue: {
      compileTemplate: true,
    },
    babel: { runtimeHelpers: true }
  }
};
