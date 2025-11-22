import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { svelteImagePreprocessor } from './src/lib/preprocessor/index.ts';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		svelteImagePreprocessor({
			formats: ['avif', 'webp', 'jpeg'],
			breakpoints: [640, 768, 1024, 1280, 1536],
			placeholder: 'blur',
		}),
		vitePreprocess()
	],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;