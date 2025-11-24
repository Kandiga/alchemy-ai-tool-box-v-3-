export interface TypographyInput {
    text: string;
    fontStyle: string;
    material: string;
    background: string;
    aspectRatio: string;
    apiKey?: string;
}

export interface TypographyOutput {
    imageUrl: string;
    promptUsed: string;
}
