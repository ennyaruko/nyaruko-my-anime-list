/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YUMMY_API: string;
  readonly VITE_YUMMY_APPLICATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.svg" {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
