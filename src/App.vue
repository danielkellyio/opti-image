<template>
  <div id="app">
    <opti-image />
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
