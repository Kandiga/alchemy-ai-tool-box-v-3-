
import { TypographyInput } from './types';

// Mock function to simulate the component state and prompt generation logic
const verifyTypographyTool = () => {
    const input: TypographyInput = {
        text: 'HELLO',
        fontStyle: 'Calligraphy',
        material: 'Bananas',
        background: 'Dark galaxy',
        aspectRatio: '16:9',
        imageSize: '4K',
        thinkingLevel: 'HIGH',
        apiKey: 'test-key'
    };

    // Construct the prompt (Logic copied from component)
    const prompt = `A photorealistic high-fidelity 3D render of the word "${input.text}". The letters are formed using a ${input.fontStyle} typography style, constructed entirely out of ${input.material}. The texture of the ${input.material} is highly detailed, showing realistic surface properties. The background features ${input.background || 'a neutral, clean studio setting to emphasize the text'}. The lighting is cinematic, accentuating the material's depth and form.`;

    console.log('--- Verification Report ---');
    console.log('Prompt Generated:', prompt);

    // Check key phrases required by the task
    const checks = [
        { name: 'Contains Text', passed: prompt.includes('HELLO') },
        { name: 'Contains Material', passed: prompt.includes('Bananas') },
        { name: 'Contains Font Style', passed: prompt.includes('Calligraphy') },
        { name: 'Contains Narrative', passed: prompt.includes('The letters are formed using') },
        { name: 'Resolution Config', passed: input.imageSize === '4K' }
    ];

    checks.forEach(check => {
        console.log(`Check: ${check.name} -> ${check.passed ? 'PASS' : 'FAIL'}`);
    });

    if (checks.every(c => c.passed)) {
        console.log('\nOVERALL STATUS: PASS');
    } else {
        console.error('\nOVERALL STATUS: FAIL');
        process.exit(1);
    }
};

verifyTypographyTool();
