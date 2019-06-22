import Vue from "vue";
import Example from "./Example.vue";
import OptiImagePlugin from "./plugin";

Vue.use(OptiImagePlugin);
Vue.config.productionTip = false;

new Vue({
  render: h => h(Example),
  props: {}
}).$mount("#app");
