import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const DEV_MODE = !!process.env.ROLLUP_WATCH;

function serve() {
  let server;
  function toExit() {
    if (server) server.kill(0);
  }
  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );
      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default [
  {
    input: "src/app.ts",
    output: {
      file: "build/app.bundle.js",
      // format: "iife",
      sourcemap: DEV_MODE,
    },
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        sourceMap: DEV_MODE,
        inlineSources: DEV_MODE,
        target: "ES2019",
        moduleResolution: "node",
      }),
      !DEV_MODE && terser(),
      DEV_MODE && serve(),
      DEV_MODE && livereload("build"),
      copy({
        targets: [{ src: "public/*", dest: "build/" }],
      }),
    ],
  },
];
