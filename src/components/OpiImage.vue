<template>
  <img
    ref="image"
    :class="{
      'opti-image-hidden': !shouldDisplay,
      'opti-image': true,
      'opti-image-in-viewport-once': inViewPortOnce
    }"
    :src="shouldDisplay && (inViewPortOnce || !lazy) ? smartSrc : ''"
    :style="`background-color:${background}`"
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
      fileTypeShortCuts: ["jpg", "gif", "png", "webp"]
    };
  },
  props: {
    lazy: { type: Boolean, default: true },
    src: { type: String, default: "" },
    backup: { type: String, default: "jpg" },
    background: { type: String, default: "" }
  },
  computed: {
    isWebP() {
      let file = this.src.split("?")[0];
      return file.endsWith(".webp");
    },
    smartBackup() {
      return this.fileTypeShortCuts.includes(this.backup)
        ? this.src.replace(/\.webp$/, this.backup)
        : this.backup;
    },
    placeholder() {
      let width = parseInt(this.$attrs.width) || 300;
      let height = parseInt(this.$attrs.height) || Math.round(width * 0.75);
      let type = this.fileTypeShortCuts.includes(this.src) ? this.src : "jpg";
      return `https://via.placeholder.com/${width}x${height}.${type}`;
    },
    smartSrc() {
      if (!this.src || this.fileTypeShortCuts.includes(this.src)) {
        return this.placeholder;
      }

      if (!this.isWebP) return this.src;
      return this.webpSupported ? this.src : this.smartBackup;
    },
    shouldDisplay() {
      return this.webpChecked || !this.isWebP;
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
      if (this.isWebP) {
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
        this.initImage();
      }
    },
    checkInViewport() {
      this.initImageInViewport();
      window.addEventListener("scroll", this.initImageInViewport);
    }
  },
  mounted() {
    if (this.lazy) this.checkInViewport();
    if (!this.lazy) this.initImage();
  },
  destroyed() {
    window.removeEventListener("scroll", this.initImageInViewport);
  }
};
</script>

<style scoped>
img {
  min-height: 1px;
  min-width: 1px;
}
.opti-image-hidden {
  opacity: 0;
}
:not(.opti-image-in-viewport-once) {
  height: 0 !important;
}
</style>
