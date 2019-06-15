import Vue from "vue";
import App from "./App.vue";
import OptiImagePlugin from "./plugin";

Vue.use(OptiImagePlugin);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  props: {}
}).$mount("#app");
