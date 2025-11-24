import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import styles from './AdGenerator.module.css';
import type { AdInput, AdOutput } from './types';

export const AdGeneratorTool: React.FC = () => {
    const [input, setInput] = useState<AdInput>({
        productName: '',
        description: '',
        targetAudience: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<AdOutput[]>([]);

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Simulate AI generation delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mockResults: AdOutput[] = [
            {
                id: '1',
                headline: `Discover the Future of ${input.productName || 'Innovation'}`,
                bodyCopy: `Experience unparalleled quality with our latest ${input.productName}. Designed for ${input.targetAudience || 'visionaries'}, this is the upgrade you've been waiting for.`,
                imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
                cta: 'Shop Now',
            },
            {
                id: '2',
                headline: `Elevate Your Lifestyle with ${input.productName || 'Style'}`,
                bodyCopy: `Join thousands of happy customers who have transformed their daily routine. Perfect for ${input.targetAudience || 'everyone'}, it's time to make a statement.`,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                cta: 'Learn More',
            },
        ];

        setResults(mockResults);
        setIsGenerating(false);
    };

    const isValid = input.productName && input.description && input.targetAudience;

    return (
        <div className={styles.container}>
            {/* Input Panel */}
            <div className={styles.inputPanel}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Product Name</label>
                    <input
                        className={styles.input}
                        value={input.productName}
                        onChange={(e) => setInput({ ...input, productName: e.target.value })}
                        placeholder="e.g., Quantum Sneakers"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        className={styles.textarea}
                        value={input.description}
                        onChange={(e) => setInput({ ...input, description: e.target.value })}
                        placeholder="Describe your product's key features..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Target Audience</label>
                    <input
                        className={styles.input}
                        value={input.targetAudience}
                        onChange={(e) => setInput({ ...input, targetAudience: e.target.value })}
                        placeholder="e.g., Urban runners, Tech enthusiasts"
                    />
                </div>

                <button
                    className={styles.generateButton}
                    onClick={handleGenerate}
                    disabled={!isValid || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className={styles.spinner} size={20} />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Generate Ads
                        </>
                    )}
                </button>
            </div>

            {/* Results Panel */}
            <div className={styles.resultsPanel}>
                {isGenerating ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner} />
                        <p>Analyzing audience patterns...</p>
                        <p style={{ fontSize: '12px', opacity: 0.7 }}>Crafting perfect copy...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className={styles.resultsGrid}>
                        {results.map((ad) => (
                            <div key={ad.id} className={styles.adCard}>
                                <img src={ad.imageUrl} alt="Ad Visual" className={styles.adImage} />
                                <div className={styles.adContent}>
                                    <h3 className={styles.adHeadline}>{ad.headline}</h3>
                                    <p className={styles.adBody}>{ad.bodyCopy}</p>
                                    <button className={styles.adCta}>{ad.cta}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.loadingContainer}>
                        <Sparkles size={48} style={{ opacity: 0.2 }} />
                        <p style={{ opacity: 0.5 }}>Fill out the form to generate personalized ads</p>
                    </div>
                )}
            </div>
        </div>
    );
};
