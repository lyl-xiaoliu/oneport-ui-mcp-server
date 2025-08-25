// Framework is now fixed to React
import {
  getOptimizationInstructions,
  getPageTypeSpecificInstructions,
} from "./helpers.js"

/**
 * List of prompts metadata available in this MCP server
 * Each prompt must have a name, description, and arguments if parameters are needed
 */
export const prompts = {
  "build-oneport-page": {
    name: "build-oneport-page",
    description:
      "Generate a complete oneport/ui page using components and blocks",
    arguments: [
      {
        name: "pageType",
        description:
          "Type of page to build (login, sidebar,)",
        required: true,
      },
      {
        name: "features",
        description: "Specific features or components needed (comma-separated)",
      },
      {
        name: "layout",
        description:
          "Layout preference (sidebar, header, full-width, centered)",
      },
      {
        name: "style",
        description: "Design style (minimal, modern, enterprise, creative)",
      },
    ],
  },
  "create-auth-flow": {
    name: "create-auth-flow",
    description:
      "Generate authentication pages using oneport/ui login blocks",
    arguments: [
      {
        name: "authType",
        description:
          "Authentication type (login, register, forgot-password, two-factor)",
        required: true,
      },
      {
        name: "providers",
        description: "Auth providers (email, google, github, apple)",
      },
      {
        name: "features",
        description:
          "Additional features (remember-me, social-login, validation)",
      },
    ],
  },
  "optimize-oneport-component": {
    name: "optimize-oneport-component",
    description:
      "Optimize or enhance existing oneport/ui components with best practices",
    arguments: [
      {
        name: "component",
        description: "Component name to optimize",
        required: true,
      },
      {
        name: "optimization",
        description:
          "Type of optimization (performance, accessibility, responsive, animations)",
      },
      {
        name: "useCase",
        description: "Specific use case or context for the component",
      },
    ],
  },
  "create-data-table": {
    name: "create-data-table",
    description: "Create advanced data tables with oneport/ui components",
    arguments: [
      {
        name: "dataType",
        description:
          "Type of data to display (users, products, orders, analytics)",
        required: true,
      },
      {
        name: "features",
        description:
          "Table features (sorting, filtering, pagination, search, selection)",
      },
      {
        name: "actions",
        description: "Row actions (edit, delete, view, custom)",
      },
    ],
  }
}

/**
 * Map of prompt names to their handler functions
 * Each handler generates the actual prompt content with the provided parameters
 */
export const promptHandlers = {
  "build-oneport-page": ({
    pageType,
    features = "",
    layout = "sidebar",
    style = "modern",
  }: {
    pageType: string
    features?: string
    layout?: string
    style?: string
  }) => {
    const framework = "react"

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Create a complete ${pageType} page using oneport/ui components and blocks for ${framework}. 

REQUIREMENTS:
- Framework: ${framework}
- Page Type: ${pageType}
- Features: ${features || "Standard features for this page type"}
- Layout: ${layout}
- Design Style: ${style}

INSTRUCTIONS:
1. First, explore available components and blocks:
   - Use 'list_components' to see all available oneport/ui components
   - Use 'list_blocks' to see available block categories
   - Use 'get_block' to fetch specific block implementations for ${pageType}

2. Build the page following these principles:
   - Use oneport/ui components and blocks as building blocks
   - Ensure responsive design with Tailwind CSS classes
   - Implement proper TypeScript types
   - Include proper accessibility attributes

3. For ${pageType} pages specifically:
   ${getPageTypeSpecificInstructions(pageType)}

4. Code Structure:
   - Use sub-components for complex sections
   - Include proper imports from oneport/ui components
   - Include proper error handling

5. Styling Guidelines:
   - Use consistent spacing and typography
   - Implement ${style} design principles
   - Ensure dark/light mode compatibility
   - Use oneport/ui design tokens
`,
          },
        },
      ],
    }
  },

  "create-auth-flow": ({
    authType,
    providers = "email",
    features = "validation",
  }: {
    authType: string
    providers?: string
    features?: string
  }) => {
    const framework = "react"

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Create a complete ${authType} authentication flow using oneport/ui login blocks and components for ${framework}.

REQUIREMENTS:
- Framework: ${framework}
- Auth Type: ${authType}
- Providers: ${providers}
- Features: ${features}

INSTRUCTIONS:
1. First, explore available components and blocks:
   - Use 'list_components' to see all available oneport/ui components
   - Use 'list_blocks' with category="login" to see available login blocks
   - Use 'get_block' to examine login-01, login-02, etc. implementations
   - Study different authentication patterns and layouts

2. Authentication Components:
   - Form validation using ${framework} best practices
   - Input components with proper error states
   - Loading states during authentication
   - Success/error feedback with toast notifications

3. Providers Implementation:
   ${providers
     .split(",")
     .map(
       (provider) =>
         `- ${provider.trim()}: Implement ${provider.trim()} authentication UI`
     )
     .join("\n   ")}

4. Security Features:
   - Form validation with proper error messages
   - Password strength indicator (if applicable)
   - CSRF protection considerations
   - Secure form submission patterns

5. UX Considerations:
   - Smooth transitions between auth states
   - Clear error messaging
   - Progressive enhancement
   - Mobile-friendly design
   - Remember me functionality (if applicable)

6. Form Features:
   ${features
     .split(",")
     .map(
       (feature) =>
         `- ${feature.trim()}: Implement ${feature.trim()} functionality`
     )
     .join("\n   ")}

7. Layout Options:
   - Choose appropriate layout from available login blocks
   - Center-aligned forms with proper spacing
   - Background images or gradients (optional)
   - Responsive design for all screen sizes

Provide complete ${framework} authentication flow code with proper TypeScript types, validation, and error handling.`,
          },
        },
      ],
    }
  },

  "optimize-oneport-component": ({
    component,
    optimization = "performance",
    useCase = "general",
  }: {
    component: string
    optimization?: string
    useCase?: string
  }) => {
    const framework = "react"

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Optimize the ${component} oneport/ui component for ${optimization} and ${useCase} use case in ${framework}.

REQUIREMENTS:
- Framework: ${framework}
- Component: ${component}
- Optimization Focus: ${optimization}
- Use Case: ${useCase}

INSTRUCTIONS:
1. First, analyze the current component:
   - Use 'get_component' to fetch the ${component} source code
   - Use 'get_component_demo' to see current usage examples
   - Use 'get_component_metadata' to understand dependencies

2. Optimization Strategy for ${optimization}:
   ${getOptimizationInstructions(optimization, framework)}

3. Use Case Specific Enhancements for ${useCase}:
   - Analyze how ${component} is typically used in ${useCase} scenarios
   - Identify common patterns and pain points
   - Suggest improvements for better developer experience

4. Implementation:
   - Provide optimized component code
   - Include performance benchmarks or considerations
   - Add proper TypeScript types and interfaces
   - Include usage examples demonstrating improvements

5. Best Practices:
   - Follow ${framework} performance best practices
   - Implement ${framework} optimization patterns where needed
   - Ensure backward compatibility
   - Add comprehensive prop validation

6. Testing Considerations:
   - Suggest test cases for the optimized component
   - Include accessibility testing recommendations
   - Performance testing guidelines

Provide the optimized ${framework} component code with detailed explanations of improvements made.`,
          },
        },
      ],
    }
  },

  "create-data-table": ({
    dataType,
    features = "sorting,filtering,pagination",
    actions = "edit,delete",
  }: {
    dataType: string
    features?: string
    actions?: string
  }) => {
    const framework = "react"

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Create an advanced data table for ${dataType} using oneport/ui components in ${framework}.

REQUIREMENTS:
- Framework: ${framework}
- Data Type: ${dataType}
- Features: ${features}
- Actions: ${actions}

INSTRUCTIONS:
1. First, explore available components:
   - Use 'list_components' to see all available oneport/ui components
   - Use 'get_component' for 'table' to see the base table implementation
   - Use 'get_component_demo' for 'table' to see usage examples
   - Use 'get_component_metadata' to understand table dependencies

2. Table Structure:
   - Create a reusable DataTable component using ${framework} patterns
   - Define proper TypeScript interfaces for ${dataType} data
   - Implement column definitions with proper typing
   - Add responsive table design

3. Features Implementation:
   ${features
     .split(",")
     .map((feature) => {
       const featureInstructions: Record<string, string> = {
         sorting:
           "- Column sorting (ascending/descending) with visual indicators",
         filtering: "- Global search and column-specific filters",
         pagination: "- Page-based navigation with configurable page sizes",
         search: "- Real-time search across all columns",
         selection: "- Row selection with bulk actions support",
       }
       return (
         featureInstructions[feature.trim()] ||
         `- ${feature.trim()}: Implement ${feature.trim()} functionality`
       )
     })
     .join("\n   ")}

4. Row Actions:
   ${actions
     .split(",")
     .map(
       (action) =>
         `- ${action.trim()}: Implement ${action.trim()} action with proper confirmation dialogs`
     )
     .join("\n   ")}

5. Data Management:
   - Create mock data for ${dataType}
   - Implement data fetching patterns using ${framework} best practices
   - Add loading states and error handling
   - Add optimistic updates for actions
   - Include data validation

6. UI/UX Features:
   - Loading skeletons during data fetch
   - Empty states when no data is available
   - Error states with retry functionality
   - Responsive design for mobile devices
   - Keyboard navigation support

7. Advanced Features:
   - Column resizing and reordering
   - Export functionality (CSV, JSON)
   - Bulk operations
   - Virtual scrolling for large datasets (if needed)

Provide complete ${framework} data table implementation with proper TypeScript types, mock data, and usage examples.`,
          },
        },
      ],
    }
  },

  "explore-components": ({
    componentName,
    analysisType = "all",
  }: {
    componentName?: string
    analysisType?: string
  }) => {
    const framework = "react"

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Explore and analyze oneport/ui components for ${framework}.

REQUIREMENTS:
- Framework: ${framework}
- Component: ${componentName || "All components"}
- Analysis Type: ${analysisType}

INSTRUCTIONS:
1. Component Discovery:
   ${componentName 
     ? `- Focus on the specific component: ${componentName}`
     : `- Use 'list_components' to see all available oneport/ui components`
   }

2. Component Analysis:
   ${componentName ? `
   - Use 'get_component' to fetch the ${componentName} source code
   - Use 'get_component_demo' to see usage examples
   - Use 'get_component_metadata' to understand dependencies and metadata
   ` : `
   - Use 'list_components' to get an overview of all components
   - Select a few key components for detailed analysis
   `}

3. Analysis Focus:
   ${analysisType === "source" ? `
   - Analyze the component source code structure
   - Review TypeScript types and interfaces
   - Examine component logic and implementation patterns
   ` : analysisType === "demo" ? `
   - Review usage examples and patterns
   - Analyze component API and props
   - Understand component behavior and interactions
   ` : analysisType === "metadata" ? `
   - Examine component dependencies
   - Review component metadata and configuration
   - Understand component relationships
   ` : `
   - Provide comprehensive analysis covering source, demo, and metadata
   - Identify best practices and usage patterns
   - Suggest improvements or alternatives
   `}

4. Key Insights:
   - Component architecture and design patterns
   - Props interface and API design
   - Styling approach and theming
   - Accessibility features
   - Performance considerations
   - Integration patterns with other components

5. Recommendations:
   - Usage best practices
   - Common pitfalls to avoid
   - Customization options
   - Integration suggestions

Provide a comprehensive analysis with code examples and practical insights.`,
          },
        },
      ],
    }
  },

  "explore-blocks": ({
    category,
    blockName,
  }: {
    category?: string
    blockName?: string
  }) => {
    const framework = "react"

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Explore and analyze oneport/ui blocks for ${framework}.

REQUIREMENTS:
- Framework: ${framework}
- Category: ${category || "All categories"}
- Block: ${blockName || "All blocks in category"}

INSTRUCTIONS:
1. Block Discovery:
   ${category 
     ? `- Focus on the specific category: ${category}`
     : `- Use 'list_blocks' to see all available block categories`
   }

2. Block Analysis:
   ${blockName ? `
   - Use 'get_block' to fetch the ${blockName} implementation
   - Analyze the block structure and components used
   - Review the code organization and patterns
   ` : category ? `
   - Use 'list_blocks' with category="${category}" to see available blocks
   - Select key blocks for detailed analysis
   ` : `
   - Use 'list_blocks' to get an overview of all block categories
   - Explore different categories to understand the variety
   `}

3. Structure Analysis:
   - Block file organization and structure
   - Component composition and relationships
   - Styling approach and design patterns
   - Data flow and state management
   - Integration with oneport/ui components

4. Key Insights:
   - Block architecture and design patterns
   - Reusable patterns and components
   - Customization options and flexibility
   - Performance considerations
   - Accessibility features

5. Implementation Patterns:
   - Common component usage patterns
   - Styling and theming approaches
   - State management strategies
   - Error handling and edge cases
   - Responsive design implementation

6. Recommendations:
   - Best practices for using blocks
   - Customization strategies
   - Integration with existing projects
   - Performance optimization tips

Provide a comprehensive analysis with code examples and practical insights for using oneport/ui blocks effectively.`,
          },
        },
      ],
    }
  },
}
