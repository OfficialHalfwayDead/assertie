import type { UserConfig } from "vite";

const config: UserConfig = {
    build: {
        minify: false,
        polyfillDynamicImport: false,
        rollupOptions: {
            treeshake: true,
        },
    },
};

export default config;