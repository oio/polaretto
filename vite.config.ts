import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelteImagePlugin } from './src/lib/plugin/index';

export default defineConfig({
	plugins: [
		svelteImagePlugin({
			formats: ['avif', 'webp', 'jpeg'],
			breakpoints: [640, 768, 1024, 1280, 1536],
			placeholder: 'blur',
		}),
		sveltekit()
	]
});
