import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { setupHandlers } from "./handler.js"
import { logError, logInfo } from "../utils/logger.js"
import { readVersion } from "../server/version.js"
import { createServer } from "../server/createServer.js"

export async function start() {
  try {
    logInfo("Starting Oneport UI MCP Server...")

    const version = await readVersion("1.0.0")
    const server = createServer(version)

    setupHandlers(server)

    const transport = new StdioServerTransport()
    logInfo("Transport initialized: stdio")

    await server.connect(transport)
    logInfo("Server started successfully")
  } catch (error) {
    logError("Failed to start server", error as Error)
    process.exit(1)
  }
}