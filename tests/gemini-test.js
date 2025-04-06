import { getGeminiResponse } from '../src/components/Gemini.jsx';
import assert from 'assert';

describe('Gemini Component Tests', () => {
    // Unit Tests
    describe('getGeminiResponse', () => {
        it('should return a typing test response when requested', async () => {
            const response = await getGeminiResponse('Create a typing test about cats');
            assert.ok(response.startsWith('true'), 'Response should start with true');
            assert.ok(response.length > 10, 'Response should contain test content');
        });

        it('should return a conversation response for questions', async () => {
            const response = await getGeminiResponse('What is a typing test?');
            assert.ok(response.startsWith('false'), 'Response should start with false');
            assert.ok(response.length > 10, 'Response should contain answer');
        });

        it('should handle empty input', async () => {
            const response = await getGeminiResponse('');
            assert.ok(response.startsWith('false'), 'Should handle empty input gracefully');
        });

        it('should handle invalid API key', async () => {
            // Temporarily invalidate API key
            process.env.VITE_API_KEY = 'invalid_key';
            const response = await getGeminiResponse('test');
            assert.ok(response.includes('Sorry, something went wrong'), 'Should handle API errors');
            // Restore API key
            process.env.VITE_API_KEY = import.meta.env.VITE_API_KEY;
        });
    });

    // Integration Tests
    describe('Gemini Chat Integration', () => {
        it('should maintain chat history', async () => {
            const history = [];
            const message1 = 'Hello';
            const message2 = 'How are you?';

            // First message
            const response1 = await getGeminiResponse(message1, history);
            history.push({ user: message1, bot: response1 });
            assert.ok(history.length === 1, 'History should have first message');

            // Second message
            const response2 = await getGeminiResponse(message2, history);
            history.push({ user: message2, bot: response2 });
            assert.ok(history.length === 2, 'History should have both messages');
        });

        it('should handle conversation context', async () => {
            const history = [];
            
            // Initial question
            const response1 = await getGeminiResponse('Create a typing test', history);
            history.push({ user: 'Create a typing test', bot: response1 });
            
            // Follow-up question
            const response2 = await getGeminiResponse('Make it harder', history);
            assert.ok(response2.startsWith('true'), 'Should understand context and create new test');
        });

        it('should sanitize responses', async () => {
            const response = await getGeminiResponse('Create a typing test');
            assert.ok(!response.includes("'"), 'Should not contain contractions');
            assert.ok(!response.includes('"'), 'Should not contain quotes');
        });
    });

    // Error Cases
    describe('Error Handling', () => {
        it('should handle network errors', async () => {
            // Simulate offline
            const originalFetch = global.fetch;
            global.fetch = () => Promise.reject(new Error('Network error'));
            
            const response = await getGeminiResponse('test');
            assert.ok(response.includes('Sorry, something went wrong'), 'Should handle network errors');
            
            // Restore fetch
            global.fetch = originalFetch;
        });
    });
});
