<template>
  <div id="app">
    <p>Open the network panel and view the image resources for this page.</p>
    <p>You should see that the image is not loaded yet because it's not in viewport</p>
    <p v-for="i in 20" :key="i">
      Just Keep Scrolling
    </p>
    <p>Now the image is loaded!</p>
    <div class="image-wrapper">
      <opti-image src="cat.webp" width="1800" height="900"></opti-image>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.image-wrapper{
  overflow:hidden;
  background:#eee;
}
.opti-image{
  transition: 0.4s ease opacity, 0.4s ease filter;
  opacity:1;
  filter: blur(0);
}

.opti-image-before-load{
  opacity:0;
  filter: blur(10px);
}
</style>
