import { build, context } from "esbuild";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if watch mode is enabled
const isWatch = process.argv.includes("--watch");
console.log("isWatch", isWatch);
// Check if production mode is enabled
const isProd = process.argv.includes("--prod");

const buildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "dist/index.js",
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: [
    // External packages that should not be bundled
    "@datastax/astra-db-ts",
    "@modelcontextprotocol/sdk",
    "jsonschema",
    "dotenv",
  ],
  minify: isProd,
  sourcemap: !isProd,
  logLevel: "info",
};

async function runBuild() {
  try {
    // if (isWatch) {
    //   console.log("Watch mode enabled");

    //   const newBuildOptions = {
    //     ...buildOptions,
    //     watch: {
    //       onRebuild(error, result) {
    //         if (error) {
    //           console.error("Watch build failed:", error);
    //         } else {
    //           // Make the output file executable
    //           fs.chmodSync("dist/index.js", "755");
    //           console.log(
    //             "Watch build succeeded:",
    //             new Date().toLocaleTimeString()
    //           );
    //         }
    //       },
    //     },
    //   };
    //   console.log("newBuildOptions", newBuildOptions);
    //   // Watch mode
    //   const ctx = await build(newBuildOptions);
    //   console.log("Watch mode started, waiting for changes...", ctx);

    //   // Make the output file executable after initial build
    //   fs.chmodSync("dist/index.js", "755");
    //   console.log("Watch mode started, waiting for changes...");

    //   // Keep the process running
    //   process.stdin.on("close", () => {
    //     ctx.stop();
    //     process.exit(0);
    //   });
    // } 

    if (isWatch) {
      const ctx = await context(buildOptions);
      await ctx.watch(); // watch começa aqui
      console.log('Watching for changes...');
    } else {
      // One-time build
      await build(buildOptions);

      // Make the output file executable
      fs.chmodSync("dist/index.js", "755");

      console.log(
        `Build completed successfully in ${isProd ? "production" : "development"
        } mode!`
      );
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

runBuild();