export const capabilities = {
    resources: {
        get_components: {
            description: "List of available oneport/ui components that can be used in the project",
            uri: "resource:get_components",
            contentType: "text/plain",
        },
        get_install_script_for_component: {
            description: "Generate installation script for a specific oneport/ui component based on package manager",
            uriTemplate: "resource-template:get_install_script_for_component?packageManager={packageManager}&component={component}",
            contentType: "text/plain",
        },
        get_installation_guide: {
            description: "Get the installation guide for oneport/ui based on build tool and package manager",
            uriTemplate: "resource-template:get_installation_guide?buildTool={buildTool}&packageManager={packageManager}",
            contentType: "text/plain",
        },
    },
    prompts: {
        component_usage: {
            description: "Get usage examples for a specific component",
            arguments: {
                componentName: {
                    type: "string",
                    description: "Name of the component to get usage for",
                },
            },
        },
        component_search: {
            description: "Search for components by name or description",
            arguments: {
                query: {
                    type: "string",
                    description: "Search query",
                },
            },
        },
        component_comparison: {
            description: "Compare two components side by side",
            arguments: {
                component1: {
                    type: "string",
                    description: "First component name",
                },
                component2: {
                    type: "string",
                    description: "Second component name",
                },
            },
        },
        component_recommendation: {
            description: "Get component recommendations based on use case",
            arguments: {
                useCase: {
                    type: "string",
                    description: "Use case description",
                },
            },
        },
        component_tutorial: {
            description: "Get a step-by-step tutorial for using a component",
            arguments: {
                componentName: {
                    type: "string",
                    description: "Name of the component for tutorial",
                },
            },
        },
    },
    tools: {
        get_component: {
            description: "Get the source code for a specific oneport/uicomponent",
            inputSchema: {
                type: "object",
                properties: {
                    componentName: {
                        type: "string",
                        description: 'Name of the oneport/ui component (e.g., "accordion", "button")',
                    },
                },
                required: ["componentName"],
            },
        },
        get_component_demo: {
            description: "Get demo code illustrating how a oneport/uicomponent should be used",
            inputSchema: {
                type: "object",
                properties: {
                    componentName: {
                        type: "string",
                        description: 'Name of the oneport/ui component (e.g., "accordion", "button")',
                    },
                },
                required: ["componentName"],
            },
        },
        list_components: {
            description: "Get all available oneport/uicomponents",
            inputSchema: {
                type: "object",
                properties: {},
            },
        }
    },
};
