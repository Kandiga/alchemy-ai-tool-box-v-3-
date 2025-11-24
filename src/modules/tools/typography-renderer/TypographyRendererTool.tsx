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
        apiKey: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<TypographyOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        setResult(null);

        // Construct the prompt
        const prompt = `Create a high-quality 3D render of the word "${input.text}" written in a ${input.fontStyle} font made of ${input.material}. ${input.background ? 'The background is ' + input.background : 'Isolated on a clean, neutral background'}. The lighting should highlight the texture of the ${input.material}. Highly detailed, photorealistic.`;

        try {
            // Check if API key is provided, otherwise simulate or error
            // For this demo, if no key is provided, we will show a mock response or error if we want strict mode.
            // But to be helpful, let's try to fetch if key is present, or mock if not.

            if (!input.apiKey) {
                // Mock behavior if no API key
                await new Promise((resolve) => setTimeout(resolve, 2000));

                // Return a placeholder image since we can't really generate without API
                // But let's just create a dummy result for the UI
                setResult({
                    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', // Abstract 3D art placeholder
                    promptUsed: prompt + " (SIMULATED)"
                });
                setIsGenerating(false);
                return;
            }

            // Real API call to Gemini
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
                                aspectRatio: input.aspectRatio
                            }
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to generate image');
            }

            const data = await response.json();

            // Extract image data
            // The response structure for images is candidates[0].content.parts[0].inlineData.data (base64)
            const candidate = data.candidates?.[0];
            // Find the part that contains the image data
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

                <div className={styles.formGroup}>
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

                <div className={styles.formGroup}>
                    <label className={styles.label}>Gemini API Key (Optional for Mock)</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={input.apiKey}
                        onChange={(e) => setInput({ ...input, apiKey: e.target.value })}
                        placeholder="Enter API Key"
                    />
                    <p style={{fontSize: '0.7rem', color: '#64748b'}}>
                        Without API key, a mock image will be shown.
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
