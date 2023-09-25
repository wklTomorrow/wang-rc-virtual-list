import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs", // CommonJS (适用于 require 等)
      exports: "named",
    },
    {
      file: pkg.module,
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
