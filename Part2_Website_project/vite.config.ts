import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        about: path.resolve(__dirname, "pages/about.html"),
        events: path.resolve(__dirname, "pages/events.html"),
        budgetCalculator: path.resolve(
          __dirname,
          "pages/budget-calculator.html",
        ),
        registration: path.resolve(__dirname, "pages/registration.html"),
        contact: path.resolve(__dirname, "pages/contact.html"),
      },
    },
  },
});
