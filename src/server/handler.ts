/**
 * Request handler setup for the Model Context Protocol (MCP) server.
 * 
 * This file configures how the server responds to various MCP requests by setting up
 * handlers for resources, resource templates, tools, and prompts.
 * 
 * Updated for MCP SDK 1.16.0 with improved error handling and request processing.
 */
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { type Server } from "@modelcontextprotocol/sdk/server/index.js";
import {  prompts } from "../prompts/index.js";
import { toolHandlers, tools } from "../tools/index.js";
import { circuitBreakers } from '../utils/circuit-breaker.js';
import { logError, logInfo } from '../utils/logger.js';


/**
 * Wrapper function to handle requests with simple error handling
 */
async function handleRequest<T>(
  method: string,
  params: any,
  handler: (validatedParams: any) => Promise<T>
): Promise<T> {
  try {
    // Validate and sanitize input parameters
    // const validatedParams = validateAndSanitizeParams(method, params);
    
    // Execute the handler with circuit breaker protection for external calls
    const result = await circuitBreakers.external.execute(() => handler(params));
    
    return result;
  } catch (error) {
    logError(`Error in ${method}`, error);
    throw error;
  }
}

/**
 * Sets up all request handlers for the MCP server
 * Following MCP SDK 1.16.0 best practices for handler registration
 * @param server - The MCP server instance
 */
export const setupHandlers = (server: Server): void => {
  logInfo('Setting up request handlers...');
  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async (request) => {
    return await handleRequest(
      'list_tools',
      request.params,
      async () => {
        // Return the tools that are registered with the server
        const registeredTools = [
          {
            name: 'get_component',
            description: 'Get the source code for a specific oneport/ui v4 component',
            inputSchema: {
              type: 'object',
              properties: {
                componentName: {
                  type: 'string',
                  description: 'Name of the oneport/ui component (e.g., "accordion", "button")',
                },
              },
              required: ['componentName'],
            },
          },
          {
            name: 'get_component_demo',
            description: 'Get demo code illustrating how a oneport/ui v4 component should be used',
            inputSchema: {
              type: 'object',
              properties: {
                componentName: {
                  type: 'string',
                  description: 'Name of the oneport/ui component (e.g., "accordion", "button")',
                },
              },
              required: ['componentName'],
            },
          },
          {
            name: 'list_components',
            description: 'Get all available oneport/ui v4 components',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          }
        ];
        
        return { tools: registeredTools };
      }
    );
  });
  


  // List available prompts
  server.setRequestHandler(ListPromptsRequestSchema, async (request) => {
    return await handleRequest(
      'list_prompts',
      request.params,
      async () => ({ prompts: Object.values(prompts) })
    );
  });

  // Tool request Handler - executes the requested tool with provided parameters
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await handleRequest(
      'call_tool',
      request.params,
      async (validatedParams: any) => {
        const { name, arguments: params } = validatedParams;
        
        if (!name || typeof name !== 'string') {
          throw new Error("Tool name is required");
        }
        
        const handler = toolHandlers[name as keyof typeof toolHandlers];

        if (!handler) {
          throw new Error(`Tool not found: ${name}`);
        }

        // Execute handler with circuit breaker protection
        const result = await circuitBreakers.external.execute(() => 
          Promise.resolve(handler(params || {}))
        );
        
        return result;
      }
    );
  });
  
  // Add global error handler
  server.onerror = (error) => {
    logError('MCP server error', error);
  };

  logInfo('Handlers setup complete');
};

