<template>
  <div id="app">
    <div>Image Not Loaded Scroll Down</div>
    <div v-for="index in 50" :key="index">Keep Scrolling</div>
    <div>Image Loaded</div>
    <div style="background:#eee; overflow:hidden;">
      <opti-image src="assets/cat.webp" width="2000" />
    </div>
  </div>
</template>
<script>
export default {
  name: "App"
};
</script>

<style>
.opti-image {
  filter: blur(0);
  opacity: 1;
  transition: 1s ease filter, 1s ease opacity;
}
.opti-image-before-load {
  filter: blur(20px);
  opacity: 0;
}
</style>
