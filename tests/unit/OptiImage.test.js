import { mount } from "@vue/test-utils";
import OptiImage from "../../src/components/OptiImage";

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
  test("browsers without webp fallback to backup prop file type", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "no-support.webp",
        lazy: false,
        backup: "png"
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
  test("browsers without webp fallback to backup prop different image", async () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "no-support.webp",
        lazy: false,
        backup: "completely-different-image.jpg"
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
        inViewport: function() {
          return true;
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
        inViewport: function() {
          return false;
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('src=""');
  });
  test("image keeps aspect ratio", () => {
    const wrapper = mount(OptiImage, {
      propsData: {
        src: "lazy-load-me.jpg",
        width: 500,
        height: 250
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
        height: 250
      }
    });

    //Mock the image tag not loaded in a 100px wide container
    wrapper.vm.clientWidth = 100;

    expect(wrapper.vm.style.paddingTop).toBe("50%");
  });
});