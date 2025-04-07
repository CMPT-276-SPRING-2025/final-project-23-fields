import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Gemini from '../src/components/Gemini';

// Mock the GoogleGenerativeAI import
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: () => ({
      startChat: () => ({
        sendMessage: async () => ({
          response: { text: () => 'Test response' }
        })
      })
    })
  }))
}));

describe('Gemini Component', () => {
  const mockProps = {
    paragraph: { text: null },
    setParagraph: vi.fn(),
    botResponse: '',
    setBotResponse: vi.fn(),
    userInput: '',
    setUserInput: vi.fn(),
    updateParagraph: vi.fn()
  };

  it('renders input field and send button', () => {
    render(<Gemini {...mockProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});