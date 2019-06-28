# Opti-Image
A Vue.js component for handling performant images without the headache.
* Webp's with fallbacks for unsupported browsers (even in srcset)
* Lazy loading out of the box
* Set standard srcset once in plugin options and it automatically applies to all opti-image components
* Pair with `opti-image-webpack-plugin` to automatically create images at different sizes for your srcsets as well as adjust image quality for the smallest size images possible
* Space reserved according to aspect ratio to prevent page jumping upon image load
* Renders just a plain old <img> tag, no wrappers, for a drop in replacement for your current <img>'s
* Built in support for [placeholder.com](https://placeholder.com/?ref=opti-image) for handy placeholder images during development
* Works with Nuxt.js (SSR)

## Installation
```
npm i opti-image
```

#### Global Use
```
//Main.js or similar
import OptiImagePlugin from 'opti-image'
Vue.use(OptiImagePlugin, {
    sizes: [1024, 768, 400]
})
```
#### Use In One Component
```
<script>
import { OptiImage } from 'opti-image'
export default {
    components: {OptiImage}
}
</script> 
```

## Demo
See opti-image in action at [danielkelly.io](https://danielkelly.io?utm_medium=opti-image). 
* Open site in Chrome to see `webp`'s and in Safari to see automatic `jpg` fallbacks.
* Lazy load and custom animations on image load used. 

## Getting Started

```
<template>
    <!-- Basic Usage with Lazy Loading and Webp Fallbacks -->
    <opti-image src="my-image.webp" />
    
    <!-- No lazy load -->
    <opti-image src="my-image.webp" :lazy="false" />
    
    <!-- Sized Placeholder -->
    <opti-image width="500" height="350" />
    
    <!-- Default 800 x 600 Placeholder -->
    <opti-image/>  
    
    <!-- Not Restrained to Container -->
    <opti-image src="my-image.webp"  :responsive="false" />
    
    // All of the above automatically have srcset if sizes set in plugin options
</template>
```

## Props
| prop | Description | Type | Default | Notes |
|------------|------------------------------------------------------------------------------|---------|---------|-------------------------------------------------------------------------------------------------------------------------------|
| src | path to the image | String | "" | If it ends in,.webp, opti-image will automatically look for a .jpg in the same filepath for browsers that don't support .webp |
| fallback | defines what image should be used in browsers where webp isn't supported | String | "jpg" | extension only (no dot) = image in same location just different extension or provide a full path |
| lazy | whether or not the image should be lazy loaded | Boolean | true |  |
| responsive | whether or not the image should scale and always fit within parent container | Boolean | true | Aspect ratio determined by width/height properties will still be maintained while image is loading |
| width | width of the image | Integer | null | width and height must be provided to reserve space for the image |
| height | height of the image | Integer | null | when set to responsive, width and height work more to determine aspect ratio than to be a hard and fast width and height |

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

#### All feedback and pull requests welcome!

#### MIT License [https://opensource.org/licenses/MIT]

