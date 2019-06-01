<template>
  <img v-if="(webpChecked && webpExistsChecked) || !webp" :src="smartSrc" />
</template>

<script>
export default {
  name: "OptiImage",
  components: {},
  data() {
    return {
      webpChecked: false,
      webpSupported: false,
      webpExistsChecked: false,
      webpExists: false
    };
  },
  props: {
    lazy: { type: Boolean, default: true },
    src: { type: String, required: true },
    webp: { type: Boolean, default: true }
  },
  computed: {
    smartSrc() {
      return this.webpSupported && this.webpExists && this.webp
        ? this.webpSrc
        : this.src;
    },
    webpSrc() {
      return this.src.replace(/\.jpg$|$\.png$/, ".webp");
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
    checkWebpImageExists() {
      return new Promise((resolve, reject) => {
        let webP = new Image();
        webP.src = this.webpSrc;
        webP.onload = webP.onerror = function() {
          webP.height > 0 ? resolve(true) : reject(false);
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
          .then(() => {
            return this.checkWebpImageExists();
          })
          .then(() => {
            this.webpExistsChecked = true;
            this.webpExists = true;
          })
          .catch(() => {
            this.webpExistsChecked = true;
            this.webpChecked = true;
          });
      }
    }
  },
  updated() {
    this.initImage();
  },
  mounted() {
    this.initImage();
  }
};
</script>
