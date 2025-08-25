import axios from "axios";
import { logError } from './logger.js';
const DOMAIN = "openapi-rdc.aliyuncs.com";
const ORGANIZATION_ID = "68099369632c29a8cb203946";
const REPOSITORY_ID = "5582713";
const TOKEN = "pt-X1nlwgmNaWuppPBLyUo7OHR4_74d557d0-f5bb-4d5d-a0e7-171956472d6d";
const REF = "feature_ui";
const SOURCE_PATH = "src/components/ui";
const DEMO_PATH = "src/app/docs/components/examples";
const REGISTRY_PATH = "src";
function getHeaders() {
    return {
        "x-yunxiao-token": TOKEN,
    };
}
async function fetchFileSource(filePath) {
    const url = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/${encodeURIComponent(filePath)}?ref=${REF}`;
    const res = await axios.get(url, { headers: getHeaders() });
    if (!res.data?.content)
        throw new Error("No content in API response");
    return Buffer.from(res.data.content, "base64").toString("utf-8");
}
async function getComponentSource(componentName) {
    const filePath = `${SOURCE_PATH}/${componentName}.tsx`;
    return fetchFileSource(filePath);
}
async function getComponentDemo(componentName) {
    const filePath = `${DEMO_PATH}/${componentName.toLowerCase()}-basic-demo.tsx`;
    const fileContent = await fetchFileSource(filePath);
    return fileContent;
}
export const fallbackComponents = [
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
async function getAvailableComponents() {
    const path = encodeURIComponent(SOURCE_PATH);
    const url = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/tree?path=${path}&ref=${REF}&type=blob`;
    try {
        const res = await axios.get(url, { headers: getHeaders() });
        if (!Array.isArray(res.data))
            throw new Error("Invalid response from tree API");
        const names = res.data
            .filter((item) => item.name.endsWith('.tsx'))
            .map((item) => item.name.replace(/\.tsx$/, ''));
        if (names.length === 0)
            return fallbackComponents;
        return names;
    }
    catch (e) {
        return fallbackComponents;
    }
}
function getBasicStructure() {
    return {
        path: REGISTRY_PATH,
        type: 'directory',
        note: 'Basic structure provided due to API limitations',
        children: {
            'ui': {
                path: `${REGISTRY_PATH}/components/ui`,
                type: 'directory',
                description: 'Contains all  UI components',
                note: 'Component files (.tsx) are located here'
            },
            'examples': {
                path: `${REGISTRY_PATH}/app/docs/components/examples`,
                type: 'directory',
                description: 'Contains component demo examples',
                note: 'Demo files showing component usage'
            },
            'lib': {
                path: `${REGISTRY_PATH}/lib`,
                type: 'directory',
                description: 'Contains utility libraries and functions'
            }
        }
    };
}
async function getComponentMetadata(componentName) {
    try {
        const registryPath = "src/lib/registry-ui.ts";
        const url = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/${encodeURIComponent(registryPath)}?ref=${REF}`;
        const response = await axios.get(url, { headers: getHeaders() });
        if (!response.data?.content) {
            throw new Error("No content in API response");
        }
        const registryContent = Buffer.from(response.data.content, "base64").toString("utf-8");
        // Find the component by name
        const componentNamePattern = `"${componentName}"`;
        const nameIndex = registryContent.indexOf(componentNamePattern);
        if (nameIndex === -1) {
            return null;
        }
        // Find the start of the object (the opening brace before the name)
        let objectStart = nameIndex;
        while (objectStart > 0 && registryContent[objectStart] !== '{') {
            objectStart--;
        }
        if (registryContent[objectStart] !== '{') {
            return null;
        }
        // Find the end of the object by counting braces
        let braceCount = 0;
        let objectEnd = objectStart;
        for (let i = objectStart; i < registryContent.length; i++) {
            if (registryContent[i] === '{') {
                braceCount++;
            }
            else if (registryContent[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    objectEnd = i + 1;
                    break;
                }
            }
        }
        if (braceCount !== 0) {
            return null;
        }
        const componentData = registryContent.substring(objectStart, objectEnd);
        // Extract metadata using more robust parsing
        const nameMatch = componentData.match(/name:\s*["']([^"']+)["']/);
        const typeMatch = componentData.match(/type:\s*["']([^"']+)["']/);
        const categoryMatch = componentData.match(/category:\s*["']([^"']+)["']/);
        const descriptionMatch = componentData.match(/description:\s*["']([^"']+)["']/);
        // Extract dependencies array
        const dependenciesMatch = componentData.match(/dependencies:\s*\[([^\]]*)\]/s);
        const dependencies = dependenciesMatch?.[1]
            ? dependenciesMatch[1]
                .split(',')
                .map((dep) => dep.trim().replace(/["']/g, ''))
                .filter((dep) => dep.length > 0)
            : [];
        // Extract registryDependencies array (if exists)
        const registryDepsMatch = componentData.match(/registryDependencies:\s*\[([^\]]*)\]/s);
        const registryDependencies = registryDepsMatch?.[1]
            ? registryDepsMatch[1]
                .split(',')
                .map((dep) => dep.trim().replace(/["']/g, ''))
                .filter((dep) => dep.length > 0)
            : [];
        // Extract files array
        const filesMatch = componentData.match(/files:\s*\[([^\]]*)\]/s);
        const files = filesMatch?.[1]
            ? filesMatch[1]
                .match(/path:\s*["']([^"']+)["']/g)
                ?.map((pathMatch) => pathMatch.match(/path:\s*["']([^"']+)["']/)?.[1])
                .filter((path) => Boolean(path)) || []
            : [];
        return {
            name: nameMatch?.[1] || componentName,
            type: typeMatch?.[1] || 'components:ui',
            category: categoryMatch?.[1] || 'ui',
            description: descriptionMatch?.[1] || '',
            dependencies: dependencies,
            registryDependencies: registryDependencies,
            files: files.map((path) => ({ path }))
        };
    }
    catch (error) {
        logError(`Error getting metadata for ${componentName}`, error);
        return null;
    }
}
function extractBlockDescription(code) {
    // Look for JSDoc comments or description comments
    const descriptionRegex = /\/\*\*[\s\S]*?\*\/|\/\/\s*(.+)/;
    const match = code.match(descriptionRegex);
    if (match) {
        // Clean up the comment
        const description = match[0]
            .replace(/\/\*\*|\*\/|\*|\/\//g, '')
            .trim()
            .split('\n')[0]
            .trim();
        return description.length > 0 ? description : null;
    }
    // Look for component name as fallback
    const componentRegex = /export\s+(?:default\s+)?function\s+(\w+)/;
    const componentMatch = code.match(componentRegex);
    if (componentMatch) {
        return `${componentMatch[1]} - A reusable UI component`;
    }
    return null;
}
/**
* Extract dependencies from import statements
* @param code The source code to analyze
* @returns Array of dependency names
*/
function extractDependencies(code) {
    const dependencies = [];
    // Match import statements
    const importRegex = /import\s+.*?\s+from\s+['"]([@\w\/\-\.]+)['"]/g;
    let match;
    match = importRegex.exec(code);
    while (match !== null) {
        const dep = match[1];
        if (!dep.startsWith('./') && !dep.startsWith('../') && !dep.startsWith('@/')) {
            dependencies.push(dep);
        }
        match = importRegex.exec(code);
    }
    return [...new Set(dependencies)]; // Remove duplicates
}
/**
* Extract component usage from code
* @param code The source code to analyze
* @returns Array of component names used
*/
function extractComponentUsage(code) {
    const components = [];
    // Extract from imports of components (assuming they start with capital letters)
    const importRegex = /import\s+\{([^}]+)\}\s+from/g;
    let match;
    match = importRegex.exec(code);
    while (match !== null) {
        const imports = match[1].split(',').map(imp => imp.trim());
        imports.forEach(imp => {
            if (imp[0] && imp[0] === imp[0].toUpperCase()) {
                components.push(imp);
            }
        });
        match = importRegex.exec(code);
    }
    // Also look for JSX components in the code
    const jsxRegex = /<([A-Z]\w+)/g;
    match = jsxRegex.exec(code);
    while (match !== null) {
        components.push(match[1]);
        match = jsxRegex.exec(code);
    }
    return [...new Set(components)]; // Remove duplicates
}
/**
* Generate usage instructions for complex blocks
* @param blockName Name of the block
* @param structure Structure information
* @returns Usage instructions string
*/
function generateComplexBlockUsage(blockName, structure) {
    const hasComponents = structure.some(item => item.name === 'components');
    let usage = `To use the ${blockName} block:\n\n`;
    usage += `1. Copy the main files to your project:\n`;
    structure.forEach(item => {
        if (item.type === 'file') {
            usage += `   - ${item.name}\n`;
        }
        else if (item.type === 'directory' && item.name === 'components') {
            usage += `   - components/ directory (${item.count} files)\n`;
        }
    });
    if (hasComponents) {
        usage += `\n2. Copy the components to your components directory\n`;
        usage += `3. Update import paths as needed\n`;
        usage += `4. Ensure all dependencies are installed\n`;
    }
    else {
        usage += `\n2. Update import paths as needed\n`;
        usage += `3. Ensure all dependencies are installed\n`;
    }
    return usage;
}
/**
* Fetch block code from the blocks directory
* @param blockName Name of the block (e.g., "calendar-01", "dashboard-01")
* @param includeComponents Whether to include component files for complex blocks
* @returns Promise with block code and structure
*/
async function getBlockCode(blockName, includeComponents = true) {
    const blocksPath = "src/app/docs/blocks";
    try {
        // First, check if it's a simple block file (.tsx)
        try {
            const blockFilePath = `${blocksPath}/${blockName}.tsx`;
            const url = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/${encodeURIComponent(blockFilePath)}?ref=${REF}`;
            const response = await axios.get(url, { headers: getHeaders() });
            if (response.data?.content) {
                const code = Buffer.from(response.data.content, "base64").toString("utf-8");
                // Extract useful information from the code
                const description = extractBlockDescription(code);
                const dependencies = extractDependencies(code);
                const components = extractComponentUsage(code);
                return {
                    name: blockName,
                    type: 'simple',
                    description: description || `Simple block: ${blockName}`,
                    code: code,
                    dependencies: dependencies,
                    componentsUsed: components,
                    size: code.length,
                    lines: code.split('\n').length,
                    usage: `Import and use directly in your application:\n\nimport { ${blockName.charAt(0).toUpperCase() + blockName.slice(1).replace(/-/g, '')} } from './blocks/${blockName}'`
                };
            }
        }
        catch (error) {
            // Continue to check for complex block directory
        }
        // Check if it's a complex block directory
        const directoryPath = `${blocksPath}/${blockName}`;
        // First, get the directory structure to see what's available
        const directoryUrl = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/tree?path=${encodeURIComponent(directoryPath)}&ref=${REF}`;
        const directoryResponse = await axios.get(directoryUrl, { headers: getHeaders() });
        if (!Array.isArray(directoryResponse.data) || directoryResponse.data.length === 0) {
            throw new Error(`Block "${blockName}" not found`);
        }
        const blockStructure = {
            name: blockName,
            type: 'complex',
            description: `Complex block: ${blockName}`,
            files: {},
            structure: [],
            totalFiles: 0,
            dependencies: new Set(),
            componentsUsed: new Set()
        };
        // Process the directory contents
        blockStructure.totalFiles = directoryResponse.data.length;
        for (const item of directoryResponse.data) {
            if (item.type === 'blob') {
                // Get the main page file
                const fileUrl = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/${encodeURIComponent(item.path)}?ref=${REF}`;
                const fileResponse = await axios.get(fileUrl, { headers: getHeaders() });
                if (fileResponse.data?.content) {
                    const content = Buffer.from(fileResponse.data.content, "base64").toString("utf-8");
                    // Extract information from the file
                    const description = extractBlockDescription(content);
                    const dependencies = extractDependencies(content);
                    const components = extractComponentUsage(content);
                    blockStructure.files[item.name] = {
                        path: item.name,
                        content: content,
                        size: content.length,
                        lines: content.split('\n').length,
                        description: description,
                        dependencies: dependencies,
                        componentsUsed: components
                    };
                    // Add to overall dependencies and components
                    dependencies.forEach((dep) => blockStructure.dependencies.add(dep));
                    components.forEach((comp) => blockStructure.componentsUsed.add(comp));
                    blockStructure.structure.push({
                        name: item.name,
                        type: 'file',
                        size: content.length,
                        description: description || `${item.name} - Main block file`
                    });
                    // Use the first file's description as the block description if available
                    if (description && blockStructure.description === `Complex block: ${blockName}`) {
                        blockStructure.description = description;
                    }
                }
            }
            else if (item.type === 'tree' && item.name === 'components' && includeComponents) {
                // Get component files
                const componentsPath = `${directoryPath}/components`;
                const componentsUrl = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/tree?path=${encodeURIComponent(componentsPath)}&ref=${REF}&type=file`;
                const componentsResponse = await axios.get(componentsUrl, { headers: getHeaders() });
                if (Array.isArray(componentsResponse.data)) {
                    blockStructure.files.components = {};
                    const componentStructure = [];
                    for (const componentItem of componentsResponse.data) {
                        if (componentItem.type === 'blob') {
                            const componentFileUrl = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/${encodeURIComponent(componentItem.path)}?ref=${REF}`;
                            const componentResponse = await axios.get(componentFileUrl, { headers: getHeaders() });
                            if (componentResponse.data?.content) {
                                const content = Buffer.from(componentResponse.data.content, "base64").toString("utf-8");
                                const dependencies = extractDependencies(content);
                                const components = extractComponentUsage(content);
                                blockStructure.files.components[componentItem.name] = {
                                    path: `components/${componentItem.name}`,
                                    content: content,
                                    size: content.length,
                                    lines: content.split('\n').length,
                                    dependencies: dependencies,
                                    componentsUsed: components
                                };
                                // Add to overall dependencies and components
                                dependencies.forEach((dep) => blockStructure.dependencies.add(dep));
                                components.forEach((comp) => blockStructure.componentsUsed.add(comp));
                                componentStructure.push({
                                    name: componentItem.name,
                                    type: 'component',
                                    size: content.length
                                });
                            }
                        }
                    }
                    blockStructure.structure.push({
                        name: 'components',
                        type: 'directory',
                        files: componentStructure,
                        count: componentStructure.length
                    });
                }
            }
        }
        // Convert Sets to Arrays for JSON serialization
        blockStructure.dependencies = Array.from(blockStructure.dependencies);
        blockStructure.componentsUsed = Array.from(blockStructure.componentsUsed);
        // Add usage instructions
        blockStructure.usage = generateComplexBlockUsage(blockName, blockStructure.structure);
        return blockStructure;
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error(`Block "${blockName}" not found. Available blocks can be found in the blocks directory.`);
        }
        throw error;
    }
}
/**
* Get all available blocks with categorization
* @param category Optional category filter
* @returns Promise with categorized block list
*/
async function getAvailableBlocks(category) {
    const blocksPath = "src/app/docs/blocks";
    try {
        const url = `https://${DOMAIN}/oapi/v1/codeup/organizations/${ORGANIZATION_ID}/repositories/${REPOSITORY_ID}/files/tree?path=${encodeURIComponent(blocksPath)}&ref=${REF}&type=file`;
        const response = await axios.get(url, { headers: getHeaders() });
        if (!Array.isArray(response.data)) {
            throw new Error('Unexpected response from API');
        }
        // Filter only tree type items as mentioned in the requirements
        const treeItems = response.data.filter((item) => item.type === 'tree');
        const blocks = {
            calendar: [],
            dashboard: [],
            login: [],
            sidebar: [],
            products: [],
            authentication: [],
            charts: [],
            mail: [],
            music: [],
            other: []
        };
        for (const item of treeItems) {
            const blockInfo = {
                name: item.name,
                type: 'complex', // All tree items are complex blocks
                path: item.path,
                size: item.size || 0,
                lastModified: 'Available'
            };
            // Add description based on name patterns
            if (item.name.includes('calendar')) {
                blockInfo.description = 'Calendar component for date selection and scheduling';
                blocks.calendar.push(blockInfo);
            }
            else if (item.name.includes('dashboard')) {
                blockInfo.description = 'Dashboard layout with charts, metrics, and data display';
                blocks.dashboard.push(blockInfo);
            }
            else if (item.name.includes('login') || item.name.includes('signin')) {
                blockInfo.description = 'Authentication and login interface';
                blocks.login.push(blockInfo);
            }
            else if (item.name.includes('sidebar')) {
                blockInfo.description = 'Navigation sidebar component';
                blocks.sidebar.push(blockInfo);
            }
            else if (item.name.includes('products') || item.name.includes('ecommerce')) {
                blockInfo.description = 'Product listing and e-commerce components';
                blocks.products.push(blockInfo);
            }
            else if (item.name.includes('auth')) {
                blockInfo.description = 'Authentication related components';
                blocks.authentication.push(blockInfo);
            }
            else if (item.name.includes('chart') || item.name.includes('graph')) {
                blockInfo.description = 'Data visualization and chart components';
                blocks.charts.push(blockInfo);
            }
            else if (item.name.includes('mail') || item.name.includes('email')) {
                blockInfo.description = 'Email and mail interface components';
                blocks.mail.push(blockInfo);
            }
            else if (item.name.includes('music') || item.name.includes('player')) {
                blockInfo.description = 'Music player and media components';
                blocks.music.push(blockInfo);
            }
            else {
                blockInfo.description = `${item.name} - Custom UI block`;
                blocks.other.push(blockInfo);
            }
        }
        // Sort blocks within each category
        Object.keys(blocks).forEach(key => {
            blocks[key].sort((a, b) => a.name.localeCompare(b.name));
        });
        // Filter by category if specified
        if (category) {
            const categoryLower = category.toLowerCase();
            if (blocks[categoryLower]) {
                return {
                    category,
                    blocks: blocks[categoryLower],
                    total: blocks[categoryLower].length,
                    description: `${category.charAt(0).toUpperCase() + category.slice(1)} blocks available`,
                    usage: `Use 'get_block' tool with the block name to get the full source code and implementation details.`
                };
            }
            else {
                return {
                    category,
                    blocks: [],
                    total: 0,
                    availableCategories: Object.keys(blocks).filter(key => blocks[key].length > 0),
                    suggestion: `Category '${category}' not found. Available categories: ${Object.keys(blocks).filter(key => blocks[key].length > 0).join(', ')}`
                };
            }
        }
        // Calculate totals
        const totalBlocks = Object.values(blocks).flat().length;
        const nonEmptyCategories = Object.keys(blocks).filter(key => blocks[key].length > 0);
        return {
            categories: blocks,
            totalBlocks,
            availableCategories: nonEmptyCategories,
            summary: Object.keys(blocks).reduce((acc, key) => {
                if (blocks[key].length > 0) {
                    acc[key] = blocks[key].length;
                }
                return acc;
            }, {}),
            usage: "Use 'get_block' tool with a specific block name to get full source code and implementation details.",
            examples: nonEmptyCategories.slice(0, 3).map(cat => blocks[cat][0] ? `${cat}: ${blocks[cat][0].name}` : '').filter(Boolean)
        };
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error('Blocks directory not found');
        }
        throw error;
    }
}
export const oneportAxios = {
    getComponentSource,
    getComponentDemo,
    getAvailableComponents,
    getComponentMetadata,
    getBlockCode,
    getAvailableBlocks,
    buildDirectoryTreeWithFallback: getBasicStructure,
};
