<template>
  <div id="app">
    <div v-for="index in 50" :key="`bye-${index}`">Hello World</div>
    <opti-image background="blue" width="500px" height="500px" />
    <div v-for="index in 50" :key="`bye-${index}`">Hello World</div>
  </div>
</template>
<script>
import OptiImage from "./components/OpiImage";
export default {
  name: "App",
  components: {
    OptiImage
  }
};
</script>

<style>
.opti-image {
  transition: 1s ease filter;
  filter: blur(0px);
}
.opti-image-hidden {
  filter: blur(30px);
}
</style>
