import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/**/*.test.ts"],
        globals: true,
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
    },
});
