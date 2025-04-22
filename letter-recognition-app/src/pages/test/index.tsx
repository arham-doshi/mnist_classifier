import React, { useState } from 'react';

const TestPage: React.FC = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleTest = () => {
        // Simulate a test action
        setResult(`You entered: ${input}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Test Page</h1>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="testInput">Enter something to test:</label>
                <input
                    id="testInput"
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    style={{ marginLeft: '10px', padding: '5px' }}
                />
            </div>
            <button onClick={handleTest} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                Test
            </button>
            {result && (
                <div style={{ marginTop: '20px', color: 'green' }}>
                    <strong>Result:</strong> {result}
                </div>
            )}
        </div>
    );
};

export default TestPage;