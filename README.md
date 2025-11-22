# polaretto - Svelte/SvelteKit Image Optimization Library

A powerful, zero-runtime image optimization library for Svelte and SvelteKit, inspired by Astro's image tools.

## Features

-   **Automatic Optimization**: Images are processed at build time using `sharp`.
-   **Responsive Images**: Automatically generates `srcset` and `sizes` for optimal loading.
-   **Multiple Formats**: Supports AVIF, WebP, and JPEG with automatic browser format negotiation.
-   **Art Direction**: Easily switch images based on media queries using the `<Picture>` component.
-   **Background Images**: Optimized background images using CSS `image-set`.
-   **Zero Runtime Overhead**: All processing happens at build time; components are lightweight wrappers.
-   **Development Cache**: Fast incremental builds and dev server startup.

## Installation

1.  Install the package (and its peer dependencies):

    ```bash
    npm install polaretto
    ```

2.  Configure **Vite** in `vite.config.ts`:

    ```typescript
    import { sveltekit } from '@sveltejs/kit/vite';
    import { defineConfig } from 'vite';
    import { svelteImagePlugin } from 'polaretto/plugin';

    export default defineConfig({
      plugins: [
        svelteImagePlugin({
          formats: ['avif', 'webp', 'jpeg'],
          breakpoints: [640, 768, 1024, 1280, 1536],
          placeholder: 'blur',
        }),
        sveltekit(),
      ],
    });
    ```

3.  Configure the **Svelte Preprocessor** in `svelte.config.js`:

    **Important:** The `svelteImagePreprocessor` must run *before* `vitePreprocess`.

    ```javascript
    import adapter from '@sveltejs/adapter-auto';
    import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
    import { svelteImagePreprocessor } from 'polaretto/preprocessor';

    /** @type {import('@sveltejs/kit').Config} */
    const config = {
      preprocess: [
        svelteImagePreprocessor({
           // Options should match vite config for consistency
           formats: ['avif', 'webp', 'jpeg'], 
           placeholder: 'blur'
        }),
        vitePreprocess(),
      ],

      kit: {
        adapter: adapter(),
      },
    };

    export default config;
    ```

## Usage

**⚠️ Important**: For the automatic optimization features (like `width`/`height`/`fit` param injection) to work, you must provide the `src` attribute as a **string literal** directly on the component.

```svelte
<!-- ✅ Works: Preprocessor can optimize this -->
<Image src="./assets/image.jpg" width={400} />

<!-- ❌ Preprocessor cannot touch this (manual import required for params) -->
<script>
  import myImage from './assets/image.jpg';
</script>
<Image src={myImage} width={400} /> 
<!-- Result: Full size image displayed at 400px width -->
```

### 1. Basic Responsive Image

Use the `<Image>` component for standard images. It automatically generates source sets for different device widths.

```svelte
<script>
  import { Image } from 'polaretto';
</script>

<!-- 
  - `src`: Path to the image. Automatically processed at build time.
  - `width`, `height`: These control the *intrinsic dimensions* of the generated image.
    If both are provided, `fit` determines how aspect ratio is handled.
    If only one is provided, the other is calculated to maintain aspect ratio.
  - `fit`: (Optional) How the image should fit the specified `width`/`height`.
    Options: 'cover' (default, crops), 'contain' (letterboxes), 'fill' (stretches),
    'inside' (resizes smaller if needed), 'outside' (resizes larger if needed).
  - `style`: (Optional) Inline CSS styles to apply to the `<img>` tag.
    This allows overriding default responsive behavior (e.g., `style="width: 100%"`).
-->
<Image 
  src="./assets/hero.jpg" 
  alt="Hero Image" 
  width={800} 
  height={600} 
  fit="cover" 
  style="border-radius: 8px;"
/>
```

### 2. Picture Component (Multiple Formats & Art Direction)

Use the `<Picture>` component to provide multiple formats (AVIF, WebP, JPEG) and implement art direction (different images for different breakpoints).

```svelte
<script>
  import { Picture } from 'polaretto';
</script>

<!-- 
  - `src`: Main image source. Also supports `width`, `height`, `fit`.
  - `formats`: (Optional) Array of image formats to generate for sources.
  - `artDirectives`: (Optional) Array of objects for art direction. Each object:
    - `media`: CSS media query string (e.g., '(max-width: 600px)').
    - `src`: Image source for this media query. Also supports `width`, `height`, `fit`.
  - `style`: (Optional) Inline CSS styles to apply to the `<img>` tag.
-->
<Picture
  src="./assets/product-desktop.jpg"
  alt="Product Photo"
  width={1200}
  height={675}
  fit="cover"
  formats={['avif', 'webp', 'jpeg']}
  artDirectives={[
    { media: '(max-width: 768px)', src: './assets/product-mobile.jpg', width: 600, height: 900, fit: 'cover' }
  ]}
  style="box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
/>
```

### 3. Background Image

Use the `<BackgroundImage>` component to apply an optimized image as a background using CSS `image-set`.

```svelte
<script>
  import { BackgroundImage } from 'polaretto';
</script>

<!-- 
  - `src`: Background image source. Also supports `width`, `height`, `fit`.
  - `class`: CSS class to apply to the wrapping `div`.
  - `style`: (Optional) Inline CSS styles to apply to the wrapping `div`.
-->
<BackgroundImage 
  src="./assets/texture.jpg" 
  class="hero-section"
  width={1920}
  height={1080}
  fit="cover"
  style="background-position: center bottom;"
>
  <h1>Welcome</h1>
</BackgroundImage>

<style>
  .hero-section {
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    /* Note: background-image properties are handled by the component. 
       You can still control other background styles here. */
  }
</style>
```

## Configuration Options

Both the Vite plugin and Preprocessor accept an options object:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `formats` | `string[]` | `['avif', 'webp', 'original']` | Output formats to generate. |
| `breakpoints` | `number[]` | `[640, 768, 1024, 1280, 1536]` | Widths to resize images to. |
| `placeholder` | `'blur' \| 'dominant-color' \| 'none'` | `'blur'` | Type of placeholder to generate. |
| `cacheDir` | `string` | `node_modules/.cache/polaretto` | Directory for caching generated images. |

## How It Works

1.  **Preprocessor**: Scans your Svelte files for `<Picture>`, `<Image>`, and `<BackgroundImage>` components. It converts `src` attributes with string literals into static imports (e.g., `import __img_0 from './image.jpg?responsive'`).
2.  **Vite Plugin**: Intercepts these imports. It uses `sharp` to resize and convert the images into multiple formats and sizes based on your configuration. It returns a JavaScript object containing the URLs and metadata (width, height, placeholder).
3.  **Components**: The Svelte components receive this data and render the appropriate HTML (`<img>`, `<picture>`, `<source>`, or CSS `image-set`).

## License

MIT