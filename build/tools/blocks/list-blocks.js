import { oneportAxios } from '../../utils/oneportAxios.js';
import { logError } from '../../utils/logger.js';
export async function handleListBlocks({ category }) {
    try {
        const blocks = await oneportAxios.getAvailableBlocks(category);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(blocks, null, 2)
                }]
        };
    }
    catch (error) {
        logError('Failed to list blocks', error);
        throw new Error(`Failed to list blocks: ${error instanceof Error ? error.message : String(error)}`);
    }
}
export const schema = {
    category: {
        type: 'string',
        description: 'Filter by category (calendar, dashboard, login, sidebar, products)'
    }
};
