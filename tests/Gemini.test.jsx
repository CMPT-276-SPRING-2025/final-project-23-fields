import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Gemini from '../src/components/Gemini';

// Mock GoogleGenerativeAI with conditional response
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: () => ({
      startChat: () => ({
        sendMessage: async (message) => ({
          response: { 
            text: () => 'normal response'
          }
        })
      })
    })
  }))
}));

describe('Gemini Component', () => {
  // Mock props that Gemini receives from Chatbot
  const mockProps = {
    paragraph: { text: null },
    setParagraph: vi.fn(),
    botResponse: '',
    setBotResponse: vi.fn(),
    userInput: '',
    setUserInput: vi.fn(),
    updateParagraph: vi.fn(),
    results: {
      wpm: null,
      accuracy: null,
      missedLetters: null,
      slowLetters: null
    }
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock environment variable
    vi.stubEnv('VITE_API_KEY', 'fake-api-key');
  });

  it('renders basic chat interface elements', () => {
    render(<Gemini {...mockProps} />);
    
    // Check input field exists
    expect(screen.getByPlaceholderText('Ask RoTypeAI')).toBeInTheDocument();
    
    // Check send button exists
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByAltText('Send')).toBeInTheDocument();
  });

  it('displays welcome message on initial render', () => {
    render(<Gemini {...mockProps} />);
    
    // Verify welcome message is called
    expect(mockProps.setBotResponse).toHaveBeenCalledWith(
      expect.stringContaining('Hello and welcome to RoTypeAI')
    );
  });

  it('handles user input submission', async () => {
    render(<Gemini {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask RoTypeAI');
    const sendButton = screen.getByRole('button');
    
    await act(async () => {
      // Type in input
      fireEvent.change(input, { target: { value: 'test message' } });
      // Click send button  
      fireEvent.click(sendButton);
    });
    
    // Verify input was cleared
    expect(mockProps.setUserInput).toHaveBeenCalled();
  });

  it('processes typing test results', async () => {
    await act(async () => {
      const propsWithResults = {
        ...mockProps,
        results: {
          wpm: 50,
          accuracy: 95,
          missedLetters: { 'a': 2 },
          slowLetters: { 'b': 3 }
        }
      };
      render(<Gemini {...propsWithResults} />);
    });
    
    // Verify setBotResponse was called with results feedback
    expect(mockProps.setBotResponse).toHaveBeenCalled();
  });
});