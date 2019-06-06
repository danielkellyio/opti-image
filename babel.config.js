module.exports = {
  presets: ["@vue/app", ["env", { modules: false }]],
  env: {
    test: {
      presets: [["env", { targets: { node: "current" } }]]
    }
  }
};
