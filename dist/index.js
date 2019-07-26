'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.function.name');
require('core-js/modules/es6.regexp.replace');
require('core-js/modules/es7.array.includes');
require('core-js/modules/es6.string.includes');
require('core-js/modules/es6.string.ends-with');
require('core-js/modules/es6.regexp.split');
var __vue_normalize__ = _interopDefault(require('vue-runtime-helpers/dist/normalize-component.js'));

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: "OptiImage",
  data: function data() {
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
    lazy: {
      type: Boolean,
      default: true
    },
    webp: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ""
    },
    fallback: {
      type: String,
      default: "jpg"
    },
    responsive: {
      type: Boolean,
      default: true
    },
    srcset: {
      type: String,
      default: ""
    },
    disablePlaceholder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style: function style() {
      var style = {};
      if (this.width) style.width = "".concat(this.width, "px");

      if (this.aspectRatio && !this.loaded) {
        style.height = 0;
        style.paddingTop = "".concat(this.aspectRatio, "%");
      } //Put all styles in here to make use in ssr easier


      style.minHeight = '1px';

      if (!this.loaded) {
        style.visibility = 'hidden';
      }

      if (this.responsive) {
        style.maxWidth = '100%';
        style.display = 'block';
        style.objectFit = 'cover';
      }

      if (this.aspectRatio && this.loaded && this.responsive) {
        style.height = "".concat(this.clientWidth * (this.aspectRatio / 100), "px");
      }

      return style;
    },
    aspectRatio: function aspectRatio() {
      if (!this.width || !this.height) return null;
      return this.height / this.width * 100;
    },
    isWebP: function isWebP() {
      if (this.webp) return true;
      var file = this.src.split("?")[0];
      return file.endsWith(".webp");
    },
    smartBackup: function smartBackup() {
      return this.fileTypeShortCuts.includes(this.fallback) ? this.src.replace(/\.webp$/i, ".".concat(this.fallback)) : this.fallback;
    },
    smartSrcset: function smartSrcset() {
      if (this.loadError) return this.srcOnError;

      if (this.optiImageSizes && this.optiImageSizes.length && !this.srcset) {
        return this.srcSetFromGlobal;
      }

      return this.webpSupported ? this.webp ? this.srcset.replace(/\.jpg|\.png|\.gif|\.jpeg/gi, '.webp') : this.srcset : this.srcset.replace(/\.webp /gi, ".".concat(this.fallback, " "));
    },
    srcSetFromGlobal: function srcSetFromGlobal() {
      var outputName = this.src,
          tempName = outputName,
          ext = this.webp && this.webpSupported ? 'webp' : tempName.split(".").pop();
      outputName = outputName.split(".").slice(0, -1).join(".");
      return this.optiImageSizes.map(function (size) {
        return "".concat(outputName, "-").concat(size, ".").concat(ext, " ").concat(size, "w");
      }).join(",");
    },
    placeholder: function placeholder() {
      var type = this.fileTypeShortCuts.includes(this.src) ? this.src : "jpg";
      var width = this.width || 800;
      var height = this.height || 600;
      return "https://via.placeholder.com/".concat(width, "x").concat(height, ".").concat(type);
    },
    width: function width() {
      return parseInt(this.$attrs.width) || null;
    },
    height: function height() {
      return parseInt(this.$attrs.height) || null;
    },
    srcOnError: function srcOnError() {
      return this.disablePlaceholder ? '' : this.placeholder + "?text=Image+Not+Found";
    },
    usesPlaceholder: function usesPlaceholder() {
      if (this.disablePlaceholder) return false;
      return !this.src || this.fileTypeShortCuts.includes(this.src);
    },
    smartSrc: function smartSrc() {
      if (this.loadError) return this.srcOnError;
      if (this.usesPlaceholder) return this.placeholder;

      if (this.webp && this.webpSupported) {
        console.log('foreced webp source', this.src.replace(/\.jpg|\.png|\.gif|\.jpeg/gi, '.webp'));
        return this.src.replace(/\.jpg|\.png|\.gif|\.jpeg/gi, '.webp');
      }

      if (!this.isWebP || this.webpSupported) return this.src;
      return this.smartBackup;
    },
    shouldDisplay: function shouldDisplay() {
      return (this.webpChecked || !this.isWebP) && (this.inViewPortOnce || !this.lazy);
    }
  },
  methods: {
    /**
     * Check client for webp support
     */
    checkWebpSupport: function checkWebpSupport() {
      return new Promise(function (resolve, reject) {
        var webP = new Image();
        webP.src = "data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMw" + "AgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA";

        webP.onload = webP.onerror = function () {
          webP.height === 2 ? resolve(true) : reject(false);
        };
      });
    },

    /**
     * Tell component that webp support has been checked and that we're good to try and display the image
     */
    initImage: function initImage() {
      var _this = this;

      if (this.isWebP) {
        this.checkWebpSupport().then(function () {
          return new Promise(function (resolve) {
            _this.webpSupported = true;
            _this.webpChecked = true;
            resolve();
          });
        }).catch(function () {
          _this.webpChecked = true;
        });
      }
    },

    /**
     * For lazy loading, init the image not on load but when it's in the viewport
     */
    initImageWhenInViewport: function initImageWhenInViewport() {
      var _this2 = this;

      if (!this.lazy) return;
      var observer = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting && !_this2.inViewPortOnce) {
          _this2.inViewPortOnce = true;

          _this2.initImage();
        }
      });
      observer.observe(this.$el);
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    //For lazy load check which images are in viewport and load accordingly
    if (this.lazy) this.initImageWhenInViewport(); //For non-lazy load go ahead and init the image

    if (!this.lazy) this.initImage();
    this.clientWidth = this.$el.clientWidth;
    window.addEventListener("resize", function () {
      _this3.clientWidth = _this3.$el.clientWidth;
    });
  }
};

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('img', {
    class: {
      'opti-image': true,
      'opti-image-before-load': !_vm.loaded,
      'opti-image-loaded': _vm.loaded,
      'opti-image-responsive': _vm.responsive,
      'opti-image-load-error': _vm.loadError
    },
    style: _vm.style,
    attrs: {
      "src": _vm.shouldDisplay ? _vm.smartSrc : '',
      "srcset": _vm.shouldDisplay ? _vm.smartSrcset : '',
      "width": _vm.width,
      "height": !_vm.responsive ? _vm.height : ''
    },
    on: {
      "load": function load($event) {
        _vm.loaded = true;
      },
      "error": function error($event) {
        _vm.shouldDisplay ? _vm.loadError = true : '';
      }
    }
  });
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

var OptiImage = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

var plugin = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      sizes: []
    };
    Vue.component(OptiImage.name, OptiImage);
    Vue.mixin({
      data: function data() {
        return {
          get optiImageSizes() {
            return options.sizes;
          }

        };
      }
    });
    Vue.$optiImageSizes = options.sizes;
  }
};

var GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

exports.OptiImage = OptiImage;
exports.default = plugin;
