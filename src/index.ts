import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { tools} from "./tools.js";
import { toolsConfig } from "./tools.config.js";
import { GetCollections } from "./tools/GetCollections.js";
import { Find } from "./Operations/Find.js";

process.argv.forEach((arg) => {
  console.log("MCP arg", arg);
});

// const tools2 = loadToolsFromYaml(process.argv[2]);
const server = new Server(
  {
    name: "astra-db-tools-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        list: true,
        call: true,
      },
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log("ListToolsRequestSchema", tools);
  return {
    tools: tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const args = request.params.arguments || {};
  const tool = toolsConfig.find((t) => t.name === toolName);
  if (!tool) {
    throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${toolName}`);
  }
  try {
    switch (tool.astraMapping.operation) {
      case "Find":
        const results = await Find(tool, args);
        return {
          content: [
            {
              type: "object",
              object: results,
            },
          ],
        };

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${toolName}`);
    }
  } catch (error) {
    console.error("Error executing tool:", error);

    // Check if error is related to API endpoint or missing env vars
    if (
      error instanceof Error &&
      (error.message.includes("ASTRA_DB_API_ENDPOINT") ||
        error.message.includes("ASTRA_DB_APPLICATION_TOKEN") ||
        error.message.includes("Invalid URL") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("Network error") ||
        !process.env.ASTRA_DB_API_ENDPOINT ||
        !process.env.ASTRA_DB_APPLICATION_TOKEN)
    ) {
      // Open browser for configuration
      return {
        content: [
          {
            type: "text",
            text: "It seems like you haven't configured your Astra DB credentials. Would you like me to open the Astra DB dashboard for you so you can sign up and get your credentials?",
          },
        ],
      };
    }

    // For other errors, return the error message
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);