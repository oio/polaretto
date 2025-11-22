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
    npm install polaretto sharp
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

### 1. Basic Responsive Image

Use the `<Image>` component for standard images. It automatically generates source sets for different device widths.

```svelte
<script>
  import { Image } from 'polaretto';
  import heroImage from './assets/hero.jpg?responsive'; // Or simply use string path in src
</script>

<!-- Using a relative path string (automatically transformed) -->
<Image 
  src="./assets/hero.jpg" 
  alt="Hero Image" 
  width={800} 
  height={600} 
/>
```

### 2. Picture Component (Multiple Formats)

Use the `<Picture>` component to provide multiple formats (AVIF, WebP, JPEG) for better compression and fallbacks.

```svelte
<script>
  import { Picture } from 'polaretto';
</script>

<Picture
  src="./assets/product.jpg"
  alt="Product"
  formats={['avif', 'webp', 'jpeg']}
/>
```

### 3. Art Direction

Switch between different images based on viewport size using the `artDirectives` prop.

```svelte
<script>
  import { Picture } from 'polaretto';
</script>

<Picture
  src="./assets/desktop.jpg"
  alt="Hero"
  artDirectives={[
    { media: '(max-width: 600px)', src: './assets/mobile.jpg' }
  ]}
/>
```

### 4. Background Image

Use the `<BackgroundImage>` component to apply an optimized image as a background using CSS `image-set`.

```svelte
<script>
  import { BackgroundImage } from 'polaretto';
</script>

<BackgroundImage 
  src="./assets/texture.jpg" 
  class="hero-section"
>
  <h1>Welcome</h1>
</BackgroundImage>

<style>
  .hero-section {
    height: 500px;
    /* ... other styles ... */
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