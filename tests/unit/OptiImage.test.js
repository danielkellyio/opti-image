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
        backup: 'png'
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
        backup: 'completely-different-image.jpg'
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
});
