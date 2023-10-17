import { readdir, readFile, exists, mkdir } from "node:fs/promises";
import {
  LambdaClient,
  CreateFunctionCommand,
  GetFunctionCommand,
  UpdateFunctionCodeCommand,
  ServiceException,
  PackageType,
  Runtime,
  Architecture,
} from "@aws-sdk/client-lambda";
import { execSync } from "child_process";

function cleanFunctions(paths: string[]) {
  execSync(`rm -rf ${paths.map((path) => `${path}/node_modules`)}`);
}

async function deployFunctions(): Promise<void> {
  try {
    const dirNames = await readdir("./functions");

    cleanFunctions(dirNames.map((dir) => `./functions/${dir}`));

    for (const dirName of dirNames) {
      const codePath = `./functions/${dirName}`;

      const buildExists = await exists('./build');

      if(!buildExists) {
        mkdir('./build');
      }

      execSync(`cp -r ./node_modules ${codePath}`);

      execSync(`zip -r ./build/${dirName}.zip ${codePath}/*`);

      const functionName = dirName;

      const zippedCode = await readFile(`./build/${functionName}.zip`);

      const client = new LambdaClient();

      const getCommand = new GetFunctionCommand({
        FunctionName: functionName,
      });

      const getCommandResponse: ServiceException | any = await client
        .send(getCommand)
        .catch((err) => err);

      let command: any;

      if (getCommandResponse.$metadata.httpStatusCode == 404) {
        command = new CreateFunctionCommand({
          Code: { ZipFile: zippedCode },
          FunctionName: functionName,
          Role: process.env.ARN_ROLE,
          Architectures: [Architecture.arm64],
          Handler: "index.execute",
          PackageType: PackageType.Zip,
          Layers: [String(process.env.ARN_BUN_LAYER)],
          Runtime: Runtime.providedal2,
        });
      } else {
        command = new UpdateFunctionCodeCommand({
          FunctionName: functionName,
          ZipFile: zippedCode,
        });
      }

      await client.send(command);

      cleanFunctions([codePath]);
    }
  } catch (error) {
    throw error;
  }
}

deployFunctions();
