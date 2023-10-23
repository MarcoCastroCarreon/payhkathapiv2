import { readdir, exists, mkdir } from "node:fs/promises";
import { execSync } from "child_process";

function cleanFunctions(paths: string[]): void {
  execSync(
    `rm -rf ${paths
      .map(
        (path) =>
          `${path}/node_modules ${path}/persistence ${path}/utils ${path}/tsconfig.json ${path}/services`
      )
      .reduce((prev, current) => {
        return `${prev} ${current}`;
      }, "")}`
  );
}

async function createBuildFolder(): Promise<void> {
  const buildExists = await exists("./build");

  if (!buildExists) {
    mkdir("./build");
  }
}

function buildZipFolder(path: string): void {
  execSync(
    `cp -r ./node_modules ${path} && cp -r ./persistence ${path} && cp -r ./utils ${path} && cp tsconfig.json ${path} && cp -r ./services ${path}`
  );
}

async function readFunctionsDirectory() {
  return await readdir("./functions");
}

async function functionsCleanUp(cb: Function) {
  const dirNames = await readFunctionsDirectory();
  const functionPaths = dirNames.map((dir) => `./functions/${dir}`);

  cleanFunctions(functionPaths);

  await cb();

  cleanFunctions(functionPaths);
}

function removeBuildFolder() {
  execSync(`rm -rf ./build`);
}

(async () => {
  try {
    if (process.argv[2] == "-f") {
      const functionName = process.argv[3];

      const functionDirectory = `./functions/${functionName}`;

      cleanFunctions([functionDirectory]);

      await createBuildFolder();

      buildZipFolder(functionDirectory);
    } else {
      const dirNames = await readFunctionsDirectory();

      await functionsCleanUp(async () => {
        for (const dirName of dirNames) {
          const codePath = `./functions/${dirName}`;

          await createBuildFolder();

          buildZipFolder(codePath);

          execSync(`cd ${codePath} && zip -r ../../build/${dirName}.zip *`);
        }
      });
    }
  } catch (error) {
    console.log(error);
    const dirNames = await readFunctionsDirectory();
    const functionPaths = dirNames.map((dir) => `./functions/${dir}`);

    cleanFunctions(functionPaths);
    removeBuildFolder();
    throw error;
  }
})();
