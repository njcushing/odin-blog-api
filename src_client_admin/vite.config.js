import dotenv from "dotenv";
const env = dotenv.config().parsed;

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        // Makes @ resolve to src for more readable import filepaths
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    define: {
        "process.env.SERVER_DOMAIN": JSON.stringify(env.SERVER_DOMAIN),
    },
});
