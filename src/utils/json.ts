// Utilities related with json files.

import fs from "fs";

/**
 * Reads and parses a json file.
 *
 * @param path The path to the file considering the current repository as root.
 * @returns A list with the list from the json file.
 */
export function loadJsonFile(path: string): Array<string> {
  const appRoot = require("app-root-path");
  try {
    const data = fs.readFileSync(
      `${appRoot}${path[0] === "/" ? path : "/" + path}`
    );
    return JSON.parse(data as any);
  } catch (err) {
    throw Error(`loadJsonFile: ${err}`);
  }
}

/**
 * Exports data to a json file.
 *
 * @param data The data to be exported (can be object or array)
 * @param path The path to the file considering the current repository as root.
 * @param mode If either to append or write a clean file.
 *  Use `a` for append and `w` for write. Defaults to `w`.
 */
export function writeJsonFile(
  data: any,
  path: string,
  mode?: string
) {
  try {
    const appRoot = require("app-root-path");
    let outputData: any;
    let resolvedMode = mode === undefined ? "w" : mode;

    if (resolvedMode === "a") {
      // Append mode: merge with existing data
      try {
        const prevData = loadJsonFile(path);
        if (Array.isArray(prevData) && Array.isArray(data)) {
          outputData = [...prevData, ...data];
        } else if (typeof prevData === 'object' && typeof data === 'object') {
          outputData = { ...prevData, ...data };
        } else {
          outputData = data;
        }
      } catch (err) {
        // File doesn't exist, use data as is
        outputData = data;
      }
    } else if (resolvedMode === "w") {
      // Write mode: overwrite with new data
      outputData = data;
    } else {
      throw Error(`Invalid mode: ${resolvedMode}`);
    }

    const jsonString = JSON.stringify(outputData, null, 2);
    const outputPath = `${appRoot}${path[0] === "/" ? path : "/" + path}`;
    
    // Ensure directory exists
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, jsonString);
    console.log(`File written to: ${outputPath}`);
  } catch (err) {
    throw Error(`writeJsonFile: ${err}`);
  }
}
