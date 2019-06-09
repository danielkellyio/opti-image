# Opti-Image
A Vue.js component for handling performant images without the headache.
* Webp's with fallbacks for unsupported browsers
* Lazy loading out of the box
* Space reserved according to aspect ratio to prevent page jumping upon image load
* Built in support for [placeholder.com](https://placeholder.com/?ref=opti-image) for handy placeholder images during development
* Works with Nuxt.js (SSR)
* 26kb minified
* Srcset Support Coming Soon!


## Installation
```
npm install github:danielkellyio/opti-image
```

## Demo
See opti-image in action at [danielkelly.io](https://danielkelly.io?utm_medium=opti-image). 
* Open site in Chrome to see `webp`'s and in Safari to see automatic `jpg` fallbacks.
* Lazy load and custom animations on image load used. 

## Getting Started
```
<template>
    <opti-image src="my-image.webp" />
</template>

<script>
import OptiImage from 'opti-image'
export default {
    components: {OptiImage}
}
</script> 
```

## Properties
* **src** (String) - path to the image. 
    * If it ends in  .webp, opti-image will automatically look for a .jpg in the same filepath for browsers that don't support .webp
    * If no src is provided a placeholder image will be displayed (made possible by [placeholder.com](https://placeholder.com/?ref=opti-image))
* **fallback** (String) - defines what image should be used in browsers where webp isn't supported
    * By default opti-image looks for a .jpg in the same filepath as specified by src 
        * (`my/image/path/image.webp` becomes `my/image/path/image.jpg`)
    * if string of "jpg", "png", or "gif" opti-image looks for that filetype in the same filepath as specified by src
    * if `/path/to/completely-different-image.jpg` that completely different image will be served
* **lazy** (Boolean) - whether or not the image should be lazy loaded
    * Default is true
    * Lazy loading means that the image request is only made once the image tag makes it into the viewport. This increases site performance and saves visitors bandwidth by only downloading images that are actually viewed. 
    * Turn off lazy loading (`:lazy="false"`) to have all images load on page load
* **responsive** (Boolean) - whether or not the image should scale and always fit within parent container
    * Default is true
    * Aspect ratio determined by width/height properties will still be maintained while image is loading
* **width** (Integer) - width of the image
* **height** (Integer) - height of the image
* (note when set to responsive width and height work more to determine aspect ratio than to be a hard and fast width and height )

## Animating Image in On Load
```
.opti-image {
  opacity: 1;
  transition: 0.5s ease opacity;
}
.opti-image-before-load {
  opacity: 0;
}
```

## Helpful Classes
* `opti-image` - static class on all <opti-image> images
* `opti-image-before-load` - class exists before image is loaded
* `opti-image-loaded` - class exists as soon as image loads
* `opti-image-load-error` - class exists when browser has issue loading image
* `opti-image-responsive` - class exists when prop responsive is true

## Examples of Handling Webp Images 
Webp with jpg fallback
```
<!-- Your code ->
<opti-image src="assets/images/my-image.webp" />

<!-- Results In Webp Supported Browsers->
<img src="assets/images/my-image.webp">

<!-- Results In Browsers WITHOUT Webp Support->
<img src="assets/images/my-image.jpg">
```
Webp with custom file type fallback
```
<!-- Your code ->
<opti-image src="assets/images/my-image.webp" fallback="png" />

<!-- Results In Webp Supported Browsers->
<img src="assets/images/my-image.webp">

<!-- Results In Browsers WITHOUT Webp Support->
<img src="assets/images/my-image.png">
```

Webp with completely different image fallback
```
<!-- Your code ->
<opti-image src="assets/images/my-image.webp" fallback="/assets/images/stop-using-safari.jpg" />

<!-- Results In Webp Supported Browsers->
<img src="assets/images/my-image.webp">

<!-- Results In Browsers WITHOUT Webp Support->
<img src="/assets/images/stop-using-safari.jpg">
```
**Important** Note that while opti-image takes away the pain of serving webp's it doesn't do anything to generate them! The webp's and their fallbacks must already exist. You can do this manually with websites like [ezgif.com](https://ezgif.com/jpg-to-webp) or you can use automated build tool solutions like [imagemin-webp](https://github.com/imagemin/imagemin-webp) or [bazzite/nuxt-optimized-images](https://github.com/bazzite/nuxt-optimized-images) if you're using nuxt
## Examples of Placeholder Images
``` 
<!-- Your code ->
<opti-image width="728" height="90" />
<!-- Results In Webp Supported Browsers->
<img src="https://via.placeholder.com/728x90" width="728" height="90">
```

``` 
<!-- Your code ->
<opti-image />
<!-- Results In Webp Supported Browsers->
<img src="https://via.placeholder.com/800x600">
```

## All feedback and pull requests welcome 
Help me make images easier to deal with :) 

#### MIT License [https://opensource.org/licenses/MIT]

