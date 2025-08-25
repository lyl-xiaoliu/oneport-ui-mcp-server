import { oneportAxios } from '../../utils/oneportAxios.js';
import { logError } from '../../utils/logger.js';
export async function handleGetDirectoryStructure({ path, owner, repo, branch }) {
    try {
        // Use the fallback structure since we're only supporting React now
        const directoryTree = oneportAxios.buildDirectoryTreeWithFallback();
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(directoryTree, null, 2)
                }]
        };
    }
    catch (error) {
        logError('Failed to get directory structure', error);
        throw new Error(`Failed to get directory structure: ${error instanceof Error ? error.message : String(error)}`);
    }
}
export const schema = {
    path: {
        type: 'string',
        description: 'Path within the repository (default:  registry)'
    },
    owner: {
        type: 'string',
        description: 'Repository owner (default: "oneport-ui")'
    },
    repo: {
        type: 'string',
        description: 'Repository name (default: "ui")'
    },
    branch: {
        type: 'string',
        description: 'Branch name (default: "main")'
    }
};
