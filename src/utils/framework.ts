/**
 * Framework selection utility for shadcn/ui MCP server
 *
 * This module handles switching between React and Svelte implementations
 * based on environment variables or command line arguments.
 *
 * Usage:
 * - Set FRAMEWORK environment variable to 'react' or 'svelte' or 'vue'
 * - Or use --framework command line argument
 * - Defaults to 'react' if not specified
 */

// Framework types
export type Framework = "react";

// Default framework
const DEFAULT_FRAMEWORK: Framework = "react";

/**
 * Get the current framework from environment or command line arguments
 * @returns The selected framework ('react' or 'svelte' or 'vue')
 */
export function getFramework(): Framework {
  return DEFAULT_FRAMEWORK;
}

/**
 * Get the axios implementation for oneport-ui
 * @returns The oneport-ui axios implementation
 */
export async function getAxiosImplementation() {
  // 直接返回 oneport-ui axios 实现
  return import("./oneportAxios.js").then((module) => module.oneportAxios);
}

/**
 * Get framework-specific information for help text
 * @returns Framework information object
 */
export function getFrameworkInfo() {
  return {
    current: "react",
    repository: "oneport-ui/ui",
    fileExtension: ".tsx",
    description: "React components from oneport-ui",
  };
}

/**
 * Validate framework selection and provide helpful feedback
 */
export function validateFrameworkSelection() {
  // 只支持react，无需校验
}
