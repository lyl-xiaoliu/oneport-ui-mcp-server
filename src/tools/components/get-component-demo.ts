import { getAxiosImplementation } from '../../utils/framework.js';
import { logError } from '../../utils/logger.js';

export async function handleGetComponentDemo({ componentName }: { componentName: string }) {
  try {
    const axios = await getAxiosImplementation();
    const demoCodes = await axios.getComponentDemo(componentName);
    return {
      content: demoCodes.map((code: string) => ({ type: "text", text: code }))
    };
  } catch (error) {
    logError(`Failed to get demo for component "${componentName}"`, error);
    throw new Error(`Failed to get demo for component "${componentName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  componentName: {
    type: 'string',
    description: 'Name of the oneport-ui component (e.g., "button", "select")'
  }
}; 