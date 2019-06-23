import Vue from "vue";
import Example from "./Example.vue";
import OptiImagePlugin from "./plugin";
import ImageSizes from '../images-sizes';

Vue.use(OptiImagePlugin, {
  sizes: ImageSizes
});
Vue.config.productionTip = false;

new Vue({
  render: h => h(Example),
  props: {}
}).$mount("#app");
