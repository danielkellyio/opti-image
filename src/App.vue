<template>
  <div id="app">
    <br v-for="index in 50" :key="index" />
    <opti-image
      :lazy="true"
      src="/assets/cat-2.jpg"
      alt="this is a cute kitty"
      width="800px"
      :webp="true"
    ></opti-image>
    <br v-for="index in 50" :key="`hey-${index}`" />
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
