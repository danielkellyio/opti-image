<template>
  <img
    ref="image"
    :class="{
      'opti-image': true,
      'opti-image-before-load': !loaded,
      'opti-image-loaded': loaded,
      'opti-image-responsive': responsive
    }"
    :src="shouldDisplay ? smartSrc : ''"
    :style="style"
    @load="
      loaded = true;
      naturalWidth = $refs.image.naturalWidth;
    "
    @error="shouldDisplay ? (loadError = true) : ''"
    :width="width"
    :height="!responsive ? height : ''"
  />
</template>

<script>
//TODO: Srcset support
export default {
  name: "OptiImage",
  data() {
    return {
      webpChecked: false,
      webpSupported: false,
      inViewPortOnce: false,
      fileTypeShortCuts: ["jpg", "gif", "png", "webp"],
      loaded: false,
      loadError: false,
      clientWidth: 0,
      naturalWidth: 0
    };
  },
  props: {
    lazy: { type: Boolean, default: true },
    src: { type: String, default: "" },
    backup: { type: String, default: "jpg" },
    responsive: { type: Boolean, default: true },
  },
  computed: {
    style() {
      let style = {};
      if (this.width) style.width = `${this.width}px`;
      if (this.aspectRatio && !this.loaded) {
        style.height = 0;
        style.paddingTop = `${this.aspectRatio}%`;
      }

      if (this.aspectRatio && this.loaded && this.responsive) {
        style.height = `${this.clientWidth * (this.aspectRatio / 100)}px`;
      }

      return style;
    },
    aspectRatio() {
      if (!this.width || !this.height) return null;
      return (this.height / this.width) * 100;
    },
    isWebP() {
      let file = this.src.split("?")[0];
      return file.endsWith(".webp");
    },
    smartBackup() {
      return this.fileTypeShortCuts.includes(this.backup)
        ? this.src.replace(/\.webp$/, `.${this.backup}`)
        : this.backup;
    },
    placeholder() {
      let type = this.fileTypeShortCuts.includes(this.src) ? this.src : "jpg";
      return `https://via.placeholder.com/${this.width}x${this.height}.${type}`;
    },
    width() {
      return parseInt(this.$attrs.width) || null;
    },
    height() {
      return parseInt(this.$attrs.height) || null;
    },
    srcOnError() {
      return this.placeholder + "?text=Image+Not+Found";
    },
    usesPlaceholder() {
      return !this.src || this.fileTypeShortCuts.includes(this.src);
    },
    smartSrc() {
      if (this.loadError) return this.srcOnError;
      if (this.usesPlaceholder) return this.placeholder;

      if (!this.isWebP || this.webpSupported) return this.src;
      return this.smartBackup;
    },
    shouldDisplay() {
      return (
        (this.webpChecked || !this.isWebP) &&
        (this.inViewPortOnce || !this.lazy)
      );
    }
  },
  methods: {
    /**
     * Check client for webp support
     */
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

    /**
     * Tell component that webp support has been checked and that we're good to try and display the image
     */
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
     * Check if the image is in the viewport
     * @returns {boolean}
     */
    inViewport() {
      let elem = this.$refs.image;
      const { top, bottom } = elem.getBoundingClientRect();
      const vHeight =
        window.innerHeight || document.documentElement.clientHeight;

      return (top > 0 || bottom > 0) && top < vHeight;
    },

    /**
     * For lazy loading, init the image not on load but when it's in the viewport
     */
    initImageWhenInViewport() {
      if (this.inViewport()) {
        this.inViewPortOnce = true;
        this.initImage();
      }
    },

    /**
     * Go ahead and check for any imgaes in viewport on load and initialize them
     * Add an scroll event listener to the window
     */
    checkInViewport() {
      if (this.lazy) {
        this.initImageWhenInViewport();
        if (window) {
          window.addEventListener("scroll", this.initImageWhenInViewport);
        }
      }
    }
  },
  mounted() {
    //For lazy load check which images are in viewport and load accordingly
    if (this.lazy) this.checkInViewport();
    //For non-lazy load go ahead and init the image
    if (!this.lazy) this.initImage();

    this.clientWidth = this.$refs.image.clientWidth;
    window.addEventListener("resize", () => {
      this.clientWidth = this.$refs.image.clientWidth;
      this.naturalWidth = this.$refs.image.naturalWidth;
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.initImageWhenInViewport);
  }
};
</script>

<style scoped>
img {
  min-height: 1px;
}
.opti-image-before-load {
  visibility: hidden;
}
.opti-image-responsive {
  max-width: 100%;
  display: block;
  object-fit: cover;
}
</style>
