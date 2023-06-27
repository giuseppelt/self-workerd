import fs from "fs/promises";
import esbuild from "esbuild";


await fs.rm("./dist", { force: true, recursive: true });

await Promise.all([
    esbuild.build({
        entryPoints: ["./src/router.ts"],
        outfile: "./dist/_router.js",
        format: "esm",
        target: "esnext",
        bundle: true,
        minify: true,
    }),
]);
