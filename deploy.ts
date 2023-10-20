import { readdir, readFile } from "node:fs/promises";
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

async function deployFunctions(): Promise<void> {
  try {
    console.log(process.argv);
    const dirNames = await readdir("./functions");

    for (const dirName of dirNames) {

      const functionName = dirName;

      const zippedCode = await readFile(`./build/${functionName}.zip`);

      const client = new LambdaClient();

      const getCommand = new GetFunctionCommand({
        FunctionName: functionName,
      });

      const getFnResponse: ServiceException | any = await client
        .send(getCommand)
        .catch((err) => err);

      let command: any;

      if (getFnResponse.$metadata.httpStatusCode == 404) {
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
    }
  } catch (error) {
    throw error;
  }
}

deployFunctions();
