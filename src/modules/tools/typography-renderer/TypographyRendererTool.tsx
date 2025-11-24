import React, { useState } from 'react';
import { Type, Loader2, Image as ImageIcon } from 'lucide-react';
import styles from './TypographyRenderer.module.css';
import type { TypographyInput, TypographyOutput } from './types';

export const TypographyRendererTool: React.FC = () => {
    const [input, setInput] = useState<TypographyInput>({
        text: '',
        fontStyle: 'Calligraphy',
        material: 'Gold',
        background: '',
        aspectRatio: '1:1',
        imageSize: '1K',
        thinkingLevel: 'HIGH',
        apiKey: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<TypographyOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        setResult(null);

        // Construct a narrative prompt for better material blending (Gemini 3.0 best practice)
        const prompt = `A photorealistic high-fidelity 3D render of the word "${input.text}". The letters are formed using a ${input.fontStyle} typography style, constructed entirely out of ${input.material}. The texture of the ${input.material} is highly detailed, showing realistic surface properties. The background features ${input.background || 'a neutral, clean studio setting to emphasize the text'}. The lighting is cinematic, accentuating the material's depth and form.`;

        try {
            if (!input.apiKey) {
                // Mock behavior if no API key
                await new Promise((resolve) => setTimeout(resolve, 2000));

                setResult({
                    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                    promptUsed: prompt + " (SIMULATED - No API Key)"
                });
                setIsGenerating(false);
                return;
            }

            // Real API call to Gemini 3.0 Pro Image Preview
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${input.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            responseModalities: ["Image"],
                            imageConfig: {
                                aspectRatio: input.aspectRatio,
                                imageSize: input.imageSize // Enforce 1K/2K/4K enum
                            }
                            // Note: thinking_level is "high" by default for this model and usually cannot be disabled.
                            // We can try sending it if needed, but default is safer for now given API variability.
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to generate image');
            }

            const data = await response.json();

            const candidate = data.candidates?.[0];
            const part = candidate?.content?.parts?.find((p: any) => p.inlineData);

            if (part?.inlineData?.data) {
                const base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setResult({
                    imageUrl: base64Image,
                    promptUsed: prompt
                });
            } else {
                throw new Error('No image data received');
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    const isValid = input.text && input.fontStyle && input.material;

    return (
        <div className={styles.container}>
            {/* Input Panel */}
            <div className={styles.inputPanel}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Text to Render</label>
                    <input
                        className={styles.input}
                        value={input.text}
                        onChange={(e) => setInput({ ...input, text: e.target.value })}
                        placeholder="e.g., HELLO"
                        maxLength={50}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Font Style</label>
                    <select
                        className={styles.select}
                        value={input.fontStyle}
                        onChange={(e) => setInput({ ...input, fontStyle: e.target.value })}
                    >
                        <option value="Calligraphy">Calligraphy</option>
                        <option value="Cursive">Cursive</option>
                        <option value="Graffiti">Graffiti</option>
                        <option value="Bold Sans-Serif">Bold Sans-Serif</option>
                        <option value="Serif">Serif</option>
                        <option value="Handwriting">Handwriting</option>
                        <option value="Gothic">Gothic</option>
                        <option value="Neon">Neon Tube</option>
                        <option value="Bubble">Bubble</option>
                        <option value="Cyberpunk">Cyberpunk</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Material</label>
                    <input
                        className={styles.input}
                        value={input.material}
                        onChange={(e) => setInput({ ...input, material: e.target.value })}
                        placeholder="e.g., Gold, Bananas, Ice, Fire"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Background (Optional)</label>
                    <input
                        className={styles.input}
                        value={input.background}
                        onChange={(e) => setInput({ ...input, background: e.target.value })}
                        placeholder="e.g., Dark galaxy, White studio"
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Aspect Ratio</label>
                        <select
                            className={styles.select}
                            value={input.aspectRatio}
                            onChange={(e) => setInput({ ...input, aspectRatio: e.target.value })}
                        >
                            <option value="1:1">1:1 (Square)</option>
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                        </select>
                    </div>

                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Resolution</label>
                        <select
                            className={styles.select}
                            value={input.imageSize}
                            onChange={(e) => setInput({ ...input, imageSize: e.target.value as any })}
                        >
                            <option value="1K">1K</option>
                            <option value="2K">2K (High)</option>
                            <option value="4K">4K (Ultra)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Gemini API Key</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={input.apiKey}
                        onChange={(e) => setInput({ ...input, apiKey: e.target.value })}
                        placeholder="Enter API Key"
                    />
                    <p style={{fontSize: '0.7rem', color: '#64748b'}}>
                        Required for image generation.
                    </p>
                </div>

                <button
                    className={styles.generateButton}
                    onClick={handleGenerate}
                    disabled={!isValid || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className={styles.spinner} size={20} />
                            Rendering...
                        </>
                    ) : (
                        <>
                            <Type size={20} />
                            Render Text
                        </>
                    )}
                </button>
            </div>

            {/* Results Panel */}
            <div className={styles.resultsPanel}>
                {isGenerating ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner} />
                        <p>Sculpting your text...</p>
                        <p style={{ fontSize: '12px', opacity: 0.7 }}>Applying materials and lighting...</p>
                    </div>
                ) : error ? (
                    <div className={styles.loadingContainer} style={{ color: '#ef4444' }}>
                        <p>Error: {error}</p>
                    </div>
                ) : result ? (
                    <div className={styles.imageContainer}>
                        <img
                            src={result.imageUrl}
                            alt="Generated Typography"
                            className={styles.generatedImage}
                        />
                        <p className={styles.promptUsed}>
                            {result.promptUsed}
                        </p>
                        <a
                            href={result.imageUrl}
                            download={`typography-${input.text}.png`}
                            className={styles.generateButton}
                            style={{ width: 'fit-content', textDecoration: 'none' }}
                        >
                            Download Image
                        </a>
                    </div>
                ) : (
                    <div className={styles.loadingContainer}>
                        <ImageIcon size={48} style={{ opacity: 0.2 }} />
                        <p style={{ opacity: 0.5 }}>Fill out the form to generate custom typography</p>
                    </div>
                )}
            </div>
        </div>
    );
};
