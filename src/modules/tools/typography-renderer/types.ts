export interface TypographyInput {
    text: string;
    fontStyle: string;
    material: string;
    background: string;
    aspectRatio: string;
    imageSize: '1K' | '2K' | '4K';
    thinkingLevel: 'LOW' | 'HIGH';
    apiKey?: string;
}

export interface TypographyOutput {
    imageUrl: string;
    promptUsed: string;
}
