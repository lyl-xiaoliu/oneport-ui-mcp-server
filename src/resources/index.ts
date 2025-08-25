/**
 * Resources implementation for the Model Context Protocol (MCP) server.
 * 
 * This file defines the resources that can be returned by the server based on client requests.
 * Resources are static content or dynamically generated content referenced by URIs.
 */

import { logError } from '../utils/logger.js';

/**
 * Resource definitions exported to the MCP handler
 * Each resource has a name, description, uri and contentType
 */
export const resources = [
  {
    name: 'get_components',
    description: 'List of available oneport/ui components that can be used in the project',
    uri: 'resource:get_components',
    contentType: 'text/plain',
  }
];

/**
 * Handler for the get_components resource
 * @returns List of available oneport/ui components
 */
const getComponentsList = async () => {
  try {
    // List of available components in oneport/ui
    // This hardcoded list can be updated in the future if needed
    const components = [
      "avatar",
      "button",
      "carousel",
      "chat-input",
      "checkbox",
      "code-display",
      "code-snippet",
      "dialog-pure",
      "drawer",
      "form",
      "input",
      "permissions-table",
      "radio-group",
      "select",
      "sidebar",
      "table",
      "tabs",
      "textarea",
      "toast",
      "tooltip",
      "topbar",
      "upload",
      "docs-layout",
      "permissions-table-pure",
      "select-pure",
      "sidebar-pure"
    ];
    
    return {
      content: JSON.stringify(components, null, 2),
      contentType: 'application/json',
    };
  } catch (error) {
    logError("Error fetching components list", error);
    return {
      content: JSON.stringify({
        error: "Failed to fetch components list",
        message: error instanceof Error ? error.message : String(error)
      }, null, 2),
      contentType: 'application/json',
    };
  }
};

/**
 * Map of resource URIs to their handler functions
 * Each handler function returns the resource content when requested
 */
export const resourceHandlers = {
  'resource:get_components': getComponentsList,
};