import { handleGetComponent } from './components/get-component.js';
import { handleGetComponentDemo } from './components/get-component-demo.js';
import { handleListComponents } from './components/list-components.js';

import { schema as getComponentSchema } from './components/get-component.js';
import { schema as getComponentDemoSchema } from './components/get-component-demo.js';
import { schema as listComponentsSchema } from './components/list-components.js';

export const toolHandlers = {
  get_component: handleGetComponent,
  get_component_demo: handleGetComponentDemo,
  list_components: handleListComponents
};

export const toolSchemas = {
  get_component: getComponentSchema,
  get_component_demo: getComponentDemoSchema,
  list_components: listComponentsSchema
};

export const tools = {
  'get_component': {
    name: 'get_component',
    description: 'Get the source code for a specific oneport-ui component',
    inputSchema: {
      type: 'object',
      properties: getComponentSchema,
      required: ['componentName']
    }
  },
  'get_component_demo': {
    name: 'get_component_demo',
    description: 'Get demo code illustrating how a oneport-ui component should be used',
    inputSchema: {
      type: 'object',
      properties: getComponentDemoSchema,
      required: ['componentName']
    }
  },
  'list_components': {
    name: 'list_components',
    description: 'Get all available oneport-ui components',
    inputSchema: {
      type: 'object',
      properties: listComponentsSchema
    }
  }
}; 