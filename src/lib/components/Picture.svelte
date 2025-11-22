<script lang="ts">
  import type { ImageData } from '../types';

  // Props using Svelte 5 $props rune
  // CRITICAL: src is now ImageData, not a string path
  // The preprocessor converts string paths to ImageData objects before this component sees them
  let { 
    src, // This is ImageData, pre-loaded by preprocessor + Vite plugin
    alt,
    sizes,
    loading = 'lazy',
    class: className = '',
    artDirectives = [],
    ...restProps
  }: { 
    src: ImageData;
    alt: string;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    class?: string;
    artDirectives?: Array<{ media: string; src: ImageData | string }>;
    [key: string]: any;
  } = $props();

  // Computed placeholder style
  // No $effect needed - data is already available!
  let placeholderStyle = $derived.by(() => {
    if (!src?.placeholder) return '';

    // Detect placeholder type from data format
    if (src.placeholder.startsWith('data:image/')) {
      return `background-image: url(${src.placeholder}); background-size: cover; background-position: center;`;
    } else if (src.placeholder.startsWith('rgb(')) {
      return `background-color: ${src.placeholder};`;
    }
    return '';
  });
</script>

<!-- No conditional rendering - data is always available at render time -->
<!-- This ensures perfect SSR with <img> in initial HTML -->
<picture class={className}>
  <!-- Art direction sources (if provided) -->
  {#if artDirectives && artDirectives.length > 0}
    {#each artDirectives as directive}
      {#if typeof directive.src === 'string'}
        <source media={directive.media} srcset={directive.src} />
      {:else}
        {#each directive.src.sources as source}
          <source
            media={directive.media}
            type={source.type}
            srcset={source.srcset}
            sizes={sizes || source.sizes || '100vw'}
          />
        {/each}
      {/if}
    {/each}
  {/if}

  <!-- Format-specific sources -->
  {#each src.sources as source}
    <source
      type={source.type}
      srcset={source.srcset}
      sizes={sizes || source.sizes || '100vw'}
    />
  {/each}

  <!-- Fallback img -->
  <img
    src={src.src}
    {alt}
    width={src.width}
    height={src.height}
    {loading}
    style={placeholderStyle}
    {...restProps}
  />
</picture>

<style>
  picture {
    display: block;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>