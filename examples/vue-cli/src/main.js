import Vue from 'vue'
import App from './App.vue'
import OptiImage from 'opti-image'

Vue.use(OptiImage)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
