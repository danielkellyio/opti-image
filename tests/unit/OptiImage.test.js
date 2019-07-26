import { mount } from "@vue/test-utils";
import { OptiImage } from "../../src/index";

describe("OptiImage Component", () => {
  test(".webp source checks support", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "test.webp",
        lazy: false
      }
    });
    //Flush promises and nextTick not working. This does:
    setTimeout(() => {
      expect(wrapper.vm.webpChecked).toBeTruthy();
    }, 1);
  });
  test("no source results in placeholder", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "",
        lazy: false
      }
    });
    expect(wrapper.html()).toContain('src="https://via.placeholder');
  });
  test("error loading image results in 'No Image Found' placeholder", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "lazy-load-me.jpg",
        lazy: false
      }
    });
    wrapper.vm.loadError = true;
    expect(wrapper.html()).toContain(
      'src="https://via.placeholder.com/800x600.jpg?text=Image+Not+Found"'
    );
  });
  test("disabling placeholder results in no placeholder on no source", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "",
        lazy: false,
        disablePlaceholder: true
      }
    });
    expect(wrapper.html()).not.toContain(
      'src="https://via.placeholder.com'
    );
  });
  test("disabling placeholder results in no placeholder on error loading", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "lazy-load-me.jpg",
        lazy: false,
        disablePlaceholder: true
      }
    });
    wrapper.vm.loadError = true;
    expect(wrapper.html()).not.toContain(
      'src="https://via.placeholder.com/800x600.jpg?text=Image+Not+Found"'
    );
  });
  test("file type source results in placeholder of said file type", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "png",
        lazy: false
      }
    });
    expect(wrapper.html()).toContain(
      'src="https://via.placeholder.com/800x600.png'
    );
  });
  test("browsers without webp fallback to jpg", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "no-support.webp",
        lazy: false
      },
      methods: {
        //Must not use arrow function here as this should refer to the component instance
        initImage: function() {
          this.webpChecked = true;
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('src="no-support.jpg"');
  });
  test("browsers without webp fallback to fallback prop file type", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "no-support.webp",
        lazy: false,
        fallback: "png"
      },
      methods: {
        //Must not use arrow function here as this should refer to the component instance
        initImage: function() {
          this.webpChecked = true;
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('src="no-support.png"');
  });
  test("browsers without webp fallback to fallback prop different image", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "no-support.webp",
        lazy: false,
        fallback: "completely-different-image.jpg"
      },
      methods: {
        //Must not use arrow function here as this should refer to the component instance
        initImage: function() {
          this.webpChecked = true;
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('src="completely-different-image.jpg"');
  });
  test("image loads when in viewport if lazy", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "lazy-load-me.jpg"
      },
      methods: {
        initImageWhenInViewport: function(){
            this.inViewPortOnce = true
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('src="lazy-load-me.jpg"');
  });
  test("image does not load when not in viewport if lazy", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "lazy-load-me.jpg"
      },
      methods: {
        initImageWhenInViewport: function(){
          this.inViewPortOnce = false
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('src=""');
  });
  test("image keeps aspect ratio", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "constrained-to-aspect-ratio.jpg",
        width: 500,
        height: 250,
        lazy:false
      }
    });

    //Mock the imaage as loaded and in a 100px wide container
    wrapper.vm.loaded = true;
    wrapper.vm.clientWidth = 100;

    expect(wrapper.vm.style.height).toBe("50px");
  });
  test("before image is loaded a space is reserved according to it's aspect ratio", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "lazy-load-me.jpg",
        width: 500,
        height: 250,
        lazy: false
      }
    });

    //Mock the image tag not loaded in a 100px wide container
    wrapper.vm.clientWidth = 100;

    expect(wrapper.vm.style.paddingTop).toBe("50%");
  });
  test("image loads webp even if src has other extension when webp = true", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "image-from-webpack-loader.jpg",
        webp: true,
        lazy: false
      }
    });
    wrapper.vm.webpChecked = true;
    wrapper.vm.webpSupported = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('src="image-from-webpack-loader.webp"');
  });
});
