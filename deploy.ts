import { readdir, readFile, exists } from "node:fs/promises";
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

const client = new LambdaClient();

const LAMBDA_TIMEOUT: number = process.env.LAMBDA_TIMEOUT
  ? +process.env.LAMBDA_TIMEOUT
  : 120;
const LAMBDA_MEMORY_SIZE: number = process.env.LAMBDA_MEMORY_SIZE
  ? +process.env.LAMBDA_MEMORY_SIZE
  : 512;

async function readAndDeploy(functionName: string, path: string) {
  console.log(`Deploying.... ${functionName}`);
  const zippedCode = await readFile(path);

  const getCommand = new GetFunctionCommand({
    FunctionName: functionName,
  });

  let command: any;
  let updateConfigCommand: UpdateFunctionConfigurationCommand | null = null;

  const getFnResponse: ServiceException | any = await client
    .send(getCommand)
    .catch((err) => err);

  console.log(`Function Found:`, getFnResponse.$metadata.httpStatusCode == 200);

  if (getFnResponse.$metadata.httpStatusCode == 404) {
    console.log("Creation Command Setted...");
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
      Timeout: LAMBDA_TIMEOUT,
      MemorySize: LAMBDA_MEMORY_SIZE,
    });
  } else {
    console.log("Update Command Setted...");
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
      Timeout: LAMBDA_TIMEOUT,
      MemorySize: LAMBDA_MEMORY_SIZE,
    });
  }

  if (updateConfigCommand) {
    console.log("Updating...");
    await client.send(updateConfigCommand);
    updateConfigCommand = null;
  }

  console.log("Sending Lambda Command...");
  await client.send(command);
}

async function deployFunctions(): Promise<void> {
  try {
    if (process.argv[2] == "-f" && process.argv[3]) {
      const functionName = process.argv[3];

      console.log(`Deploying.... ${functionName}`);

      const zipPath = `./build/${functionName}.zip`;

      console.log(`Zip Path -> ${zipPath}`);

      const functionExists = await exists(zipPath);

      if (!functionExists) throw new Error("Function zipped not found");

      await readAndDeploy(functionName, zipPath);
    } else {
      const dirNames = await readdir("./functions");

      for (const dirName of dirNames) {
        const functionName = dirName;

        const zipPath = `./build/${functionName}.zip`;
        await readAndDeploy(functionName, zipPath);
      }
    }

    console.log("Process Finished");
  } catch (error: any) {
    console.log(`Process Failed => ${error.message}`);
  }
}

deployFunctions();
