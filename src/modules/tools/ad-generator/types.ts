export interface AdInput {
    productName: string;
    description: string;
    targetAudience: string;
}

export interface AdOutput {
    id: string;
    headline: string;
    bodyCopy: string;
    imageUrl: string;
    cta: string;
}
