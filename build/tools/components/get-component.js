import { oneportAxios } from '../../utils/oneportAxios.js';
import { logError } from '../../utils/logger.js';
export async function handleGetComponent({ componentName }) {
    try {
        const sourceCode = await oneportAxios.getComponentSource(componentName);
        return {
            content: [{ type: "text", text: sourceCode }]
        };
    }
    catch (error) {
        logError(`Failed to get component "${componentName}"`, error);
        throw new Error(`Failed to get component "${componentName}": ${error instanceof Error ? error.message : String(error)}`);
    }
}
export const schema = {
    componentName: {
        type: 'string',
        description: 'Name of the oneport-ui component (e.g., "button", "select")'
    }
};
