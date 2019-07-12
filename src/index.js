import OptiImage from "./OptiImage.vue";
const plugin = {
  install(Vue, options = { sizes: [] }) {
    Vue.component(OptiImage.name, OptiImage);
    Vue.mixin({
      data() {
        return {
          get optiImageSizes() {
            return options.sizes;
          }
        };
      }
    });
    Vue.$optiImageSizes = options.sizes;
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
