module.exports = {
  presets: ["@vue/app", ["@babel/preset-env"]],
  env: {
    test: {
      presets: [["env", { targets: { node: "current" } }]]
    }
  }
};
