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
    style = '',
    width,
    height,
    fit,
    placeholder, // Add this
    artDirectives = [],
    ...restProps
  }: { 
    src: ImageData;
    alt: string;
    sizes?: string;
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'; // Add type
    placeholder?: 'blur' | 'dominant-color' | 'traced-svg' | 'pixelated' | 'none'; // Add type
    loading?: 'lazy' | 'eager';
    class?: string;
    style?: string;
    artDirectives?: Array<{ media: string; src: ImageData | string }>;
    [key: string]: any;
  } = $props();

  // Computed placeholder style
  // No $effect needed - data is already available!
  let placeholderStyle = $derived.by(() => {
    if (!src?.placeholder) return '';

    let bgImage = '';
    if (Array.isArray(src.placeholder)) {
        bgImage = src.placeholder.map(url => `url(${url})`).join(', ');
    } else {
        bgImage = `url(${src.placeholder})`;
    }

    let style = `background-image: ${bgImage}; background-size: cover; background-position: center;`;

    if (placeholder === 'pixelated') {
      style += ' image-rendering: -moz-crisp-edges; image-rendering: pixelated;';
    }

    return style;
  });

  // Merge placeholder style with user style and explicit height
  let finalStyle = $derived([
    placeholderStyle, 
    height ? `height: ${height}px` : '',
    style
  ].filter(Boolean).join('; '));
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
    style={finalStyle}
    {...restProps}
  />
</picture>

<style>
  picture {
    display: block;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
</style>