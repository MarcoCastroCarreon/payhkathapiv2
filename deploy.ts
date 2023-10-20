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
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";

async function deployFunctions(): Promise<void> {
  try {
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
      let updateConfigCommand: UpdateFunctionConfigurationCommand | null = null;

      if (getFnResponse.$metadata.httpStatusCode == 404) {
        command = new CreateFunctionCommand({
          Code: { ZipFile: zippedCode },
          FunctionName: functionName,
          Role: process.env.ARN_ROLE,
          Architectures: [Architecture.arm64],
          Handler: process.env.EXECUTION_HANDLER,
          PackageType: PackageType.Zip,
          Layers: [String(process.env.ARN_BUN_LAYER)],
          Runtime: Runtime.providedal2,
          Environment: {
            Variables: {
              MONGO_URI: process.env.MONGO_URI ?? "",
            },
          },
          Timeout: 120000
        });
      } else {
        command = new UpdateFunctionCodeCommand({
          FunctionName: functionName,
          ZipFile: zippedCode,
        });

        updateConfigCommand = new UpdateFunctionConfigurationCommand({
          FunctionName: functionName,
          Environment: {
            Variables: {
              MONGO_URI: process.env.MONGO_URI ?? "",
            },
          },
          Handler: process.env.EXECUTION_HANDLER,
          Role: process.env.ARN_ROLE,
          Timeout: 120000
        });
      }

      if (updateConfigCommand) {
        await client.send(updateConfigCommand);
        updateConfigCommand = null;
      }

      await client.send(command);
    }
  } catch (error) {
    throw error;
  }
}

deployFunctions();
