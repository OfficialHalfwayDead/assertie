import type { UserConfig } from "vite";

const config: UserConfig = {
    build: {
        target: "node16",
        minify: false,
        outDir: ".test-build",
        emptyOutDir: true,
        ssr: "test/runtime/main.ts",
        rollupOptions: {
            external: [/^node:/],
            output: {
                format: "es",
                entryFileNames: "test.js",
            },
        },
    },
};

export default config;
