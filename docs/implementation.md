Here is the **Revised Technical Specification**. It merges the robust Sharp/Caching logic from the previous plan with the **Preprocessor Architecture** required to solve the SSR and Vite bundling issues.

--- START OF FILE HYBRID_IMAGETOOLS.md ---

# Hybrid ImageTools: Architecture & Implementation Guide

## Overview

This document outlines the implementation of a high-performance image optimization library for SvelteKit. It combines the **Developer Experience** of Astro ImageTools with the **SSR-safety** of Svelte's build system.

### The "Hybrid" Architecture

To avoid the pitfalls of dynamic imports (which break Vite bundling) and client-side fetching (which breaks SEO/SSR), this library uses a **Preprocessor-First** approach:

1.  **Svelte Preprocessor**: Scans your code _before_ compilation. It finds `<Picture>` tags, extracts their props (src, widths, formats), and converts them into **static imports** at the top of your file.
2.  **Vite Plugin**: Intercepts these static imports. It uses **Sharp** to process the images, cache them, and returns a JSON metadata object.
3.  **Dumb Components**: The components receive the pre-calculated metadata object and render HTML immediately. No `$effect`, no client-side logic, perfect SSR.

---

## 1. Project Structure

```
svelte-imagetools/
├── package.json
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Picture.svelte          # Dumb renderer (receives Object)
│   │   │   └── Image.svelte            # Dumb renderer (receives Object)
│   │   ├── core/
│   │   │   ├── processor.ts            # Sharp logic (resize/convert)
│   │   │   ├── cache.ts                # Filesystem caching
│   │   │   └── metadata.ts             # JSON response builder
│   │   ├── preprocessor/               # THE NEW LAYER
│   │   │   ├── index.ts                # Main preprocessor entry
│   │   │   └── ast-utils.ts            # AST traversal helpers
│   │   ├── vite-plugin/
│   │   │   └── index.ts                # Intercepts ?imagetools requests
│   │   ├── utils/
│   │   │   └── hashes.ts               # Stable hashing
│   │   └── types/
│   │       └── index.ts
```

---

## 2. Phase 1: The Svelte Preprocessor (The "Rewriter")

This is the most critical component for DX. It allows users to write string paths, but delivers objects to the runtime.

**Dependencies:** `magic-string`, `svelte/compiler`, `estree-walker`.

**File:** `src/lib/preprocessor/index.ts`

```typescript
import { parse } from "svelte/compiler";
import MagicString from "magic-string";
import { walk } from "estree-walker";
import crypto from "crypto";

export function imagePreprocessor() {
  return {
    name: "svelte-imagetools-preprocessor",
    markup({ content, filename }) {
      // 1. Parse AST
      const ast = parse(content, { filename });
      const s = new MagicString(content);
      const imports: string[] = [];

      // 2. Walk the AST
      walk(ast.html, {
        enter(node: any) {
          if (
            node.type === "InlineComponent" &&
            (node.name === "Picture" || node.name === "Image")
          ) {
            // 3. Extract Props
            const srcAttr = node.attributes.find((a: any) => a.name === "src");
            const configAttrs = node.attributes.filter((a: any) =>
              ["widths", "formats", "quality", "artDirectives"].includes(a.name)
            );

            if (srcAttr && srcAttr.value[0].type === "Text") {
              const srcPath = srcAttr.value[0].data;

              // 4. Serialize Configuration to Query String
              // We grab the raw values of config attributes to pass to the plugin
              const queryParams = new URLSearchParams();
              configAttrs.forEach((attr: any) => {
                // Logic to extract raw string/expression from attribute
                // Simple ex: widths={[400,800]} -> "widths=400;800"
                // Complex logic needed here to parse the expression content
              });

              // 5. Generate Unique Import
              const hash = crypto
                .createHash("shake256", { outputLength: 8 })
                .update(srcPath + queryParams.toString())
                .digest("hex");
              const varName = `__img_${hash}`;

              imports.push(
                `import ${varName} from "${srcPath}?imagetools&${queryParams}";`
              );

              // 6. Rewrite Source Code
              // Replace src="path" with src={__img_hash}
              // Remove build-time config props so they don't hit the DOM
              s.overwrite(srcAttr.start, srcAttr.end, `src={${varName}}`);
              configAttrs.forEach((attr: any) =>
                s.remove(attr.start, attr.end)
              );
            }
          }
        },
      });

      // 7. Inject Imports
      if (imports.length > 0) {
        const scriptMatch = content.match(/<script[^>]*>/);
        if (scriptMatch) {
          s.appendLeft(
            scriptMatch.index! + scriptMatch[0].length,
            "\n" + imports.join("\n")
          );
        } else {
          s.prepend(`<script>\n${imports.join("\n")}\n</script>`);
        }
      }

      return {
        code: s.toString(),
        map: s.generateMap({ source: filename }),
      };
    },
  };
}
```

---

## 3. Phase 2: The Vite Plugin (The Builder)

Handles the actual image processing when Vite requests the imported ID.

**File:** `src/lib/vite-plugin/index.ts`

```typescript
import type { Plugin } from "vite";
import { transformImage } from "../core/processor"; // Sharp logic
import { ImageCache } from "../core/cache";

export function svelteImagePlugin(): Plugin {
  const cache = new ImageCache();

  return {
    name: "vite-plugin-svelte-imagetools",
    enforce: "pre",

    async load(id) {
      // 1. Intercept requests generated by the Preprocessor
      const url = new URL(id, "file://");
      if (!url.searchParams.has("imagetools")) return null;

      const filepath = url.pathname;

      // 2. Reconstruct config from Query Params
      const config = {
        widths: url.searchParams.get("widths")?.split(";").map(Number),
        formats: url.searchParams.get("formats")?.split(";"),
        // ...
      };

      // 3. Check Cache & Process
      // (Use the robust transform logic from the previous plan)
      const metadata = await transformImage(filepath, config, cache);

      // 4. Return Metadata as Default Export
      return `export default ${JSON.stringify(metadata)}`;
    },
  };
}
```

---

## 4. Phase 3: Core Processor (Sharp)

**File:** `src/lib/core/processor.ts`

This remains largely the same as the previous high-quality plan, ensuring we generate the correct assets.

```typescript
import sharp from "sharp";
import type { ImageData, ImageConfig } from "../types";

export async function transformImage(
  path: string,
  config: ImageConfig,
  cache: any
): Promise<ImageData> {
  // 1. Read Buffer
  // 2. Generate Hash key
  // 3. If cached, return JSON

  // 4. Process
  const image = sharp(path);
  const meta = await image.metadata();

  const sources: Record<string, string> = {};

  // Loop formats (avif, webp, jpg)
  for (const format of config.formats) {
    const srcSetParts = [];
    // Loop widths
    for (const width of config.widths) {
      // Resize & Output to node_modules/.cache/assets/
      // Add result to srcSetParts
    }
    sources[`image/${format}`] = srcSetParts.join(", ");
  }

  return {
    img: { src: fallbackPath, w: meta.width, h: meta.height },
    sources: sources,
    placeholder: await generateBase64Placeholder(image), // Tiny 20px blurred base64
  };
}
```

---

## 5. Phase 4: Dumb Components (Svelte 5)

These components are simple because all the hard work was done at build time. They are **Pure Functions** of their props.

**File:** `src/lib/components/Picture.svelte`

```svelte
<script lang="ts">
  import type { ImageData } from '../types';

  let {
    src, // This receives the OBJECT from the import, not the string
    alt,
    sizes = "100vw",
    class: className,
    loading = "lazy",
    decoding = "async",
    ...rest
  } = $props();

  // Helper to parse the sources for iteration
  let sources = $derived(Object.entries(src.sources));
</script>

<picture>
  {#each sources as [type, srcset]}
    <source {type} {srcset} {sizes} />
  {/each}

  <img
    src={src.img.src}
    width={src.img.w}
    height={src.img.h}
    {alt}
    {class}
    {loading}
    {decoding}
    {...rest}
    style:background-size="cover"
    style:background-image={src.placeholder ? `url('${src.placeholder}')` : undefined}
  />
</picture>

<style>
  img {
    /* Smooth fade-in effect for placeholder */
    transition: opacity 0.5s ease-in-out;
  }
</style>
```

---

## 6. Handling Art Direction

The preprocessor needs special logic for `artDirectives` because it involves nested paths.

**Preprocessor Logic Update:**
When parsing `<Picture>`, if `artDirectives` is found:

1.  Traverse the Array Expression in the AST.
2.  For each Object in the array, find the `src` property.
3.  Extract that path.
4.  Generate a _separate_ import for it: `import __art_1 from "./mobile.jpg?imagetools..."`.
5.  Overwrite the `src` property in the AST to point to `__art_1`.

**Resulting Component Prop:**
The component receives:

```js
artDirectives = [
  {
    media: "(max-width: 600px)",
    src: {
      /* ImageData Object */
    },
  },
];
```

**Component Render Logic:**

```svelte
<picture>
  <!-- Art Direction Sources -->
  {#each artDirectives as art}
    {#each Object.entries(art.src.sources) as [type, srcset]}
      <source media={art.media} {type} {srcset} {sizes} />
    {/each}
  {/each}

  <!-- Main Sources -->
  ...
</picture>
```

---

## 7. Final Checklist for Implementation

1.  **Init:** `npm create svelte@latest`.
2.  **Deps:** Install `sharp`, `magic-string`, `estree-walker`.
3.  **Core:** Write `processor.ts` to prove you can convert images via Sharp.
4.  **Plugin:** Write `vite-plugin` to serve those processed images on import.
5.  **Preprocessor:** Write the AST walker. This is the hardest part. Test it by logging the modified code to console before running.
6.  **Components:** Write the Svelte 5 components.
7.  **Config:** Update `svelte.config.js` to use the preprocessor and `vite.config.ts` to use the plugin.

This architecture guarantees **SSR support** (HTML is ready on server render), **SEO** (img tags exist immediately), and **Performance** (images processed at build time).

--- END OF FILE HYBRID_IMAGETOOLS.md ---
