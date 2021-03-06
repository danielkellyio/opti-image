<template>
  <img
    :class="{
      'opti-image': true,
      'opti-image-before-load': !loaded,
      'opti-image-loaded': loaded,
      'opti-image-responsive': responsive,
      'opti-image-load-error': loadError
    }"
    :src="shouldDisplay ? smartSrc : ''"
    :srcset="shouldDisplay ? smartSrcset : ''"
    :style="style"
    @load="loaded = true"
    @error="shouldDisplay ? (loadError = true) : ''"
    :width="width"
    :height="!responsive ? height : ''"
  />
</template>

<script>
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
      clientWidth: 0
    };
  },
  props: {
    lazy: { type: Boolean, default: true },
    webp: { type: Boolean, default: false },
    src: { type: String, default: "" },
    fallback: { type: String, default: "jpg" },
    responsive: { type: Boolean, default: true },
    srcset: { type: String, default: "" },
    disablePlaceholder: { type: Boolean, default: false }
  },
  computed: {
    style() {
      let style = {};
      if (this.width) style.width = `${this.width}px`;
      if (this.aspectRatio && !this.loaded) {
        style.height = 0;
        style.paddingTop = `${this.aspectRatio}%`;
      }
      
      //Put all styles in here to make use in ssr easier
      style.minHeight = '1px';
      
      if(!this.loaded){
        style.visibility = 'hidden';
      }
      
      if(this.responsive){
        style.maxWidth = '100%';
        style.display = 'block';
        style.objectFit = 'cover';
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
      if( this.webp ) return true
      let file = this.src.split("?")[0];
      return file.endsWith(".webp");
    },
    smartBackup() {
      return this.fileTypeShortCuts.includes(this.fallback)
        ? this.src.replace(/\.webp$/i, `.${this.fallback}`)
        : this.fallback;
    },
    smartSrcset() {
      if (this.loadError) return this.srcOnError;
      if (this.optiImageSizes && this.optiImageSizes.length && !this.srcset) {
        return this.srcSetFromGlobal;
      }
      return this.webpSupported
        ? this.webp ? this.srcset.replace(/\.jpg|\.png|\.gif|\.jpeg/gi, '.webp') : this.srcset
        : this.srcset.replace(/\.webp /gi, `.${this.fallback} `);
    },
    srcSetFromGlobal() {
      let outputName = this.src,
        tempName = outputName,
        ext = this.webp && this.webpSupported ? 'webp' : tempName.split(".").pop();

      outputName = outputName
        .split(".")
        .slice(0, -1)
        .join(".");

      return this.optiImageSizes
        .map(size => {
          return `${outputName}-${size}.${ext} ${size}w`;
        })
        .join(",");
    },
    placeholder() {
      const type = this.fileTypeShortCuts.includes(this.src) ? this.src : "jpg";
      const width = this.width || 800;
      const height = this.height || 600;
      return `https://via.placeholder.com/${width}x${height}.${type}`;
    },
    width() {
      return parseInt(this.$attrs.width) || null;
    },
    height() {
      return parseInt(this.$attrs.height) || null;
    },
    srcOnError() {
      return this.disablePlaceholder ? '' : this.placeholder + "?text=Image+Not+Found";
    },
    usesPlaceholder() {
      if(this.disablePlaceholder) return false
      return !this.src || this.fileTypeShortCuts.includes(this.src);
    },
    smartSrc() {
      if (this.loadError) return this.srcOnError;
      if (this.usesPlaceholder) return this.placeholder;
      if(this.webp && this.webpSupported){
        console.log('foreced webp source', this.src.replace(/\.jpg|\.png|\.gif|\.jpeg/gi, '.webp'))
        return this.src.replace(/\.jpg|\.png|\.gif|\.jpeg/gi, '.webp');
      }
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
     * For lazy loading, init the image not on load but when it's in the viewport
     */
    initImageWhenInViewport() {
      if( !this.lazy ) return;
      const observer = new IntersectionObserver((e) => {
        if (e[0].isIntersecting && !this.inViewPortOnce ) {
          this.inViewPortOnce = true;
          this.initImage()
        }
      })
      observer.observe(this.$el)
    }
  },
  mounted() {
    //For lazy load check which images are in viewport and load accordingly
    if (this.lazy) this.initImageWhenInViewport();
    //For non-lazy load go ahead and init the image
    if (!this.lazy) this.initImage();

    this.clientWidth = this.$el.clientWidth;
    window.addEventListener("resize", () => {
      this.clientWidth = this.$el.clientWidth;
    });
  }
};
</script>
