<script lang="ts">
  import type { ImageData } from '../types';

  let { 
    src, // ImageData object, pre-loaded by preprocessor
    class: className = '',
    children,
    ...restProps
  }: { 
    src: ImageData;
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();

  // Generate CSS image-set
  // No $effect needed - data is immediately available
  let backgroundStyle = $derived.by(() => {
    if (!src) return '';

    const imageSets = src.sources
      .map(source => {
        const urls = source.srcset.split(', ').map(entry => {
          const [url] = entry.split(' ');
          return `url("${url}") type("${source.type}")`;
        });
        return urls.join(', ');
      })
      .join(', ');

    return `background-image: image-set(${imageSets}); background-size: cover; background-position: center;`;
  });
</script>

<div
  class={className}
  style={backgroundStyle}
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  div {
    position: relative;
  }
</style>