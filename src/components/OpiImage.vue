<template>
  <img
    ref="image"
    :class="{
      'opti-image-hidden': !shouldDisplay,
      'opti-image': true
    }"
    :src="shouldDisplay && (inViewPortOnce || !lazy) ? smartSrc : ''"
  />
</template>

<script>
//TODO: Width height ratio support
//TODO: Background color support
//TODO: Srcset support

export default {
  name: "OptiImage",
  components: {},
  data() {
    return {
      webpChecked: false,
      webpSupported: false,
      inViewPortOnce: false,
      currentlyInViewport: false
    };
  },
  props: {
    lazy: { type: Boolean, default: true },
    src: { type: String, required: true },
    webp: { type: Boolean, default: true }
  },
  computed: {
    smartSrc() {
      return this.webpSupported && this.webp ? this.webpSrc : this.src;
    },
    webpSrc() {
      return this.src.replace(/\.jpg$|$\.png$/, ".webp");
    },
    shouldDisplay() {
      return this.webpChecked || !this.webp;
    }
  },
  methods: {
    checkWebpSupport() {
      return new Promise((resolve, reject) => {
        let webP = new Image();
        webP.src =
          "data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMw" +
          "AgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA";
        webP.onload = webP.onerror = function() {
          webP.height === 2 ? resolve(true) : reject(false);
        };
      });
    },
    initImage() {
      if (this.webp) {
        this.checkWebpSupport()
          .then(() => {
            return new Promise(resolve => {
              this.webpSupported = true;
              this.webpChecked = true;
              resolve();
            });
          })
          .catch(() => {
            this.webpChecked = true;
          });
      }
    },
    /**
     * Thanks Chris Ferdinandi for simple vanilla js way of detecting in viewport
     * https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/
     * @returns {boolean}
     */
    inViewport() {
      let elem = this.$refs.image;
      let bounding = elem.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    initImageInViewport() {
      if (this.inViewport()) {
        this.inViewPortOnce = true;
        this.currentlyInViewport = true;
        this.initImage();
      }
    },
    checkInViewport() {
      this.initImageInViewport();
      window.addEventListener("scroll", () => {
        this.initImageInViewport();
      });
    }
  },
  mounted() {
    if (this.lazy) this.checkInViewport();
    if (!this.lazy) this.initImage();
  }
};
</script>

<style>
img {
  min-height: 1px;
  min-width: 1px;
}
.opti-image-hidden {
  opacity: 0;
}
</style>
