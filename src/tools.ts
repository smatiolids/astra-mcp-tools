import type { Schema } from "jsonschema";
import { toolsConfig } from "./tools.config.js";

type Tool = {
  name: string;
  description: string;
  inputSchema: Schema;
};

export interface ToolMapping {
  name: string;
  description: string;
  astraMapping: {
    operation: string;
    collectionName: string;
    filter?: any;
    vectorize?: string;
    limit?: number;
  };
  inputSchema: Schema;
}

export const loadTools = async (): Promise<Tool[]>  => {
  // return tools;
  return toolsConfig.map((tool: ToolMapping) => ({ 
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  } as Tool));
}

export const tools: Tool[] = [
  {
    name: "GetCollections",
    description: "Get all collections in the Astra DB database",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  ...(await loadTools())

] as const satisfies {
  name: string;
  description: string;
  inputSchema: Schema;
}[];

