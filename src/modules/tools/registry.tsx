import type { Tool } from './_types/tool.types';
import { Megaphone } from 'lucide-react';
import { AdGeneratorTool } from './ad-generator/AdGeneratorTool';

// Registry to store all available tools
const toolsRegistry: Tool[] = [
    {
        id: 'ad-generator',
        name: 'Personalized Ad Generator',
        description: 'Generate high-converting ad copy and visuals for your products.',
        icon: Megaphone,
        component: AdGeneratorTool,
        categoryId: 'image', // Assigning to Image Generation
    },
];

export const registerTool = (tool: Tool) => {
    // Prevent duplicate registration
    if (!toolsRegistry.find((t) => t.id === tool.id)) {
        toolsRegistry.push(tool);
    }
};

export const getToolsByCategory = (categoryId: string): Tool[] => {
    return toolsRegistry.filter((tool) => tool.categoryId === categoryId);
};

export const getToolById = (toolId: string): Tool | undefined => {
    return toolsRegistry.find((tool) => tool.id === toolId);
};

export const getAllTools = (): Tool[] => {
    return toolsRegistry;
};
