import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/fcc-datavis/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        barChart: resolve(__dirname, "bar-chart/index.html"),
        scatterplot: resolve(__dirname, "scatterplot/index.html"),
        heatmap: resolve(__dirname, "heatmap/index.html"),
        choropleth: resolve(__dirname, "choropleth/index.html"),
      },
    },
  },
});
