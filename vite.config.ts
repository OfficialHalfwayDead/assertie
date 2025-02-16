import type { UserConfig } from "vite";

const config: UserConfig = {
    build: {
        minify: false,
        modulePreload: {
            polyfill: false,
        },
        rollupOptions: {
            treeshake: true,
        },
    },
};

export default config;