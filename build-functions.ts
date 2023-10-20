import { readdir, exists, mkdir } from "node:fs/promises";
import { execSync } from "child_process";

function cleanFunctions(paths: string[]) {
  execSync(
    `rm -rf ${paths
      .map((path) => `${path}/node_modules ${path}/persistence ${path}/utils ${path}/tsconfig.json`)
      .reduce((prev, current) => {
        return `${prev} ${current}`;
      }, "")}`
  );
}

(async () => {
  try {
    const dirNames = await readdir("./functions");

    cleanFunctions(dirNames.map((dir) => `./functions/${dir}`));

    for (const dirName of dirNames) {
      const codePath = `./functions/${dirName}`;

      const buildExists = await exists("./build");

      if (!buildExists) {
        mkdir("./build");
      }

      execSync(
        `cp -r ./node_modules ${codePath} && cp -r ./persistence ${codePath} && cp -r ./utils ${codePath} && cp tsconfig.json ${codePath}`
      );

      execSync(`cd ${codePath} && zip -r ../../build/${dirName}.zip *`);

      cleanFunctions([codePath]);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
})();
