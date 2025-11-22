/// <reference types="vite/client" />

declare module '*.jpg?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.jpeg?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.png?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.webp?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.avif?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}