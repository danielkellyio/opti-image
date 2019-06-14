<template>
  <div id="app">
    <div v-for="index in 50" :key="index">hello</div>
    <div style="background:#eee; overflow:hidden;">
      <opti-image
        src="/assets/cat-2.webp"
        srcset="
             /assets/cat-2.webp 320w,
             /assets/cat-2.webp 480w,
             /assets/cat-2.webp 800w"
        width="2000"
      />
    </div>
  </div>
</template>
<script>
import OptiImage from "./components/OptiImage";
export default {
  name: "App",
  components: {
    OptiImage
  }
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
