import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
    },
  ],
  plugins: [
    external(),
    resolve(),
    babel({
      exclude: "node_modules/**",
    }),
    postcss({
      extensions: [".less"],
      use: [["less", { lessOptions: { javascriptEnabled: true } }]],
      inject: true, // 将样式注入到 js 中
    }),
    commonjs(),
    typescript(),
    terser(),
  ],
};
