import { handleGetComponent } from './components/get-component.js';
import { handleGetComponentDemo } from './components/get-component-demo.js';
import { handleListComponents } from './components/list-components.js';
import { handleGetComponentMetadata } from './components/get-component-metadata.js';
import { handleGetDirectoryStructure } from './repository/get-directory-structure.js';
import { handleGetBlock } from './blocks/get-block.js';
import { handleListBlocks } from './blocks/list-blocks.js';

import { schema as getComponentSchema } from './components/get-component.js';
import { schema as getComponentDemoSchema } from './components/get-component-demo.js';
import { schema as listComponentsSchema } from './components/list-components.js';
import { schema as getComponentMetadataSchema } from './components/get-component-metadata.js';
import { schema as getDirectoryStructureSchema } from './repository/get-directory-structure.js';
import { schema as getBlockSchema } from './blocks/get-block.js';
import { schema as listBlocksSchema } from './blocks/list-blocks.js';


export const toolHandlers = {
  get_component: handleGetComponent,
  get_component_demo: handleGetComponentDemo,
  list_components: handleListComponents,
  get_component_metadata: handleGetComponentMetadata,
  get_directory_structure: handleGetDirectoryStructure,
  get_block: handleGetBlock,
  list_blocks: handleListBlocks
};

export const toolSchemas = {
  get_component: getComponentSchema,
  get_component_demo: getComponentDemoSchema,
  list_components: listComponentsSchema,
  get_component_metadata: getComponentMetadataSchema,
  get_directory_structure: getDirectoryStructureSchema,
  get_block: getBlockSchema,
  list_blocks: listBlocksSchema
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
  },
  'get_component_metadata': {
    name: 'get_component_metadata',
    description: 'Get metadata for a specific oneport/ui  component',
    inputSchema: {
      type: 'object',
      properties: getComponentMetadataSchema,
      required: ['componentName']
    }
  },
  'get_directory_structure': {
    name: 'get_directory_structure',
    description: 'Get the directory structure of the oneport-ui  repository',
    inputSchema: {
      type: 'object',
      properties: getDirectoryStructureSchema
    }
  },
  'get_block': {
    name: 'get_block',
    description: 'Get source code for a specific oneport/ui  block (e.g., calendar-01, dashboard-01)',
    inputSchema: {
      type: 'object',
      properties: getBlockSchema,
      required: ['blockName']
    }
  },
  'list_blocks': {
    name: 'list_blocks',
    description: 'Get all available oneport/ui  blocks with categorization',
    inputSchema: {
      type: 'object',
      properties: listBlocksSchema
    }
  }
}; 