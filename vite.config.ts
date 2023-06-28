import path from "path";
import { defineConfig } from "vite";
import banner from "vite-plugin-banner";
import packageJson from "./package.json";
import styleInject from "./plugins/style-inject";

const packageName = packageJson.name;
const outputName = "dropdown";

const getPascalCaseName = () => {
  try {
    return packageName
      .replace(new RegExp(/[-_]+/, "g"), " ")
      .replace(new RegExp(/[^\w\s]/, "g"), "")
      .replace(
        new RegExp(/\s+(.)(\w+)/, "g"),
        ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
      )
      .replace(new RegExp(/\s/, "g"), "")
      .replace(new RegExp(/\w/), (s) => s.toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileNames = {
  es: `${outputName}.es.js`,
  umd: `${outputName}.umd.js`,
  iife: `${outputName}.iife.js`,
};

const pkgInfo = `/**
 * name: ${packageJson.name}
 * version: ${packageJson.version}
 * description: ${packageJson.description}
 * author: ${packageJson.author}
 * homepage: ${packageJson.homepage}
 * repository: ${packageJson.repository.url}
 */`;

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: getPascalCaseName(),
      formats: ["es", "umd", "iife"],
      fileName: (format) => fileNames[format],
    },
  },
  plugins: [banner(pkgInfo), styleInject()],
});
