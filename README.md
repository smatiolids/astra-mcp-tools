# ASTRA DB MCP TOOLS

Implement MCP Tools to connect Data to Agents

## Configuration

Edit the `tools.config.ts` file to add new tools.

Each tool has a name, description, input schema, and astra mapping.

The input schema is used to validate the tool call arguments.

The astra mapping is used to map the tool call arguments to the astra db query.