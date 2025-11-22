<script lang="ts">
  import type { ImageData } from '../types';

  let {
    src, // ImageData object, pre-loaded by preprocessor
    alt,
    sizes,
    width,
    height,
    loading = 'lazy',
    class: className = '',
    ...restProps
  }: { 
    src: ImageData;
    alt: string;
    sizes?: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    class?: string;
    [key: string]: any;
  } = $props();

  // Use first source's srcset (typically AVIF or WebP)
  let srcset = $derived(src?.sources[0]?.srcset || '');
  let finalSizes = $derived(sizes || src?.sources[0]?.sizes || '100vw');

  let placeholderStyle = $derived.by(() => {
    if (!src?.placeholder) return '';

    if (src.placeholder.startsWith('data:image/')) {
      return `background-image: url(${src.placeholder}); background-size: cover; background-position: center;`;
    } else if (src.placeholder.startsWith('rgb(')) {
      return `background-color: ${src.placeholder};`;
    }
    return '';
  });
</script>

<!-- No conditional - data is always available for perfect SSR -->
<img
  src={src.src}
  {alt}
  {srcset}
  sizes={finalSizes}
  width={width || src.width}
  height={height || src.height}
  {loading}
  class={className}
  style={placeholderStyle}
  {...restProps}
/>

<style>
  img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>