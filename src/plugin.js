import OptiImage from "./components/OptiImage";
const plugin = {
  install(Vue, options = { srcsetSizes: [] }) {
    Vue.component(OptiImage.name, OptiImage);
    Vue.optiImageSrcsetSizes = options.srcsetSizes;
  }
};
export { OptiImage };
export default plugin;

//Auto-install
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}
