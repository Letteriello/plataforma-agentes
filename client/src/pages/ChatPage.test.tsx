import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ChatPage from './ChatPage';
import { chatService } from '@/api/chatService';
import type { ChatMessage, Session } from '@/types';

// Polyfill for TextEncoder, TextDecoder, ReadableStream if needed by components/logic
// Though with chatService mocked, direct usage might be avoided here.
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(global as any).ReadableStream = ReadableStream;

// Mock chatService
jest.mock('@/api/chatService');
const mockChatService = chatService as jest.Mocked<typeof chatService>;

// Mock config module to prevent import.meta.env issues from it during test setup
jest.mock('../config', () => ({
  getApiBaseUrlFromEnv: jest.fn(() => 'http://mock-api-from-chatpage-test.com'), // Provide a default mock URL
}));

// Mock UI components from @/components/ui/resizable to simplify ChatPage testing
jest.mock('@/components/ui/resizable', () => {
  const React = require('react');
  return {
    ResizablePanelGroup: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'resizable-panel-group' }, children),
    ResizablePanel: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'resizable-panel' }, children),
    ResizableHandle: () => React.createElement('div', { 'data-testid': 'resizable-handle' }),
  };
});

// Mock child chat components
const mockConversationListFn = jest.fn();
jest.mock('@/components/chat/ConversationList', () => {
  const React = require('react');
  const MockedConversationList = (props: any) => {
    mockConversationListFn(props);
    return React.createElement(
      'div',
      { 'data-testid': 'conversation-list' },
      'Active: ',
      props.activeConversationId,
      React.createElement(
        'button',
        { onClick: () => props.onSelectConversation('session1') },
        'Select Session 1'
      )
    );
  };
  return MockedConversationList;
});

const mockChatInterfaceFn = jest.fn();
jest.mock('@/components/chat/ChatInterface', () => {
  const React = require('react');
  const MockedChatInterface = (props: any) => {
    mockChatInterfaceFn(props);
    return React.createElement(
      'div',
      { 'data-testid': 'chat-interface' },
      props.messages?.map((msg: ChatMessage) =>
        React.createElement(
          'div',
          { key: msg.id, 'data-testid': `message-${msg.id}` },
          msg.text,
          msg.isStreaming && ' (streaming...)'
        )
      ),
      React.createElement(
        'button',
        { onClick: () => props.onSendMessage('Test user message') },
        'Send'
      ),
      props.isLoading && React.createElement('div', null, 'Loading messages...'),
      props.error && React.createElement('div', { role: 'alert' }, props.error)
    );
  };
  return MockedChatInterface;
});

// Mock crypto.randomUUID for stable IDs if not already handled by Jest setup
global.crypto = {
  ...global.crypto,
  randomUUID: () => 'mocked-uuid-' + Math.random().toString(36).substring(2, 15),
};


describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConversationListFn.mockClear(); // Clear the renamed function
    mockChatInterfaceFn.mockClear();   // Clear the renamed function
    // Default mock implementations
    mockChatService.fetchSessionMessages.mockResolvedValue([]);
    mockChatService.sendMessage.mockImplementation(
      async (_sessionId, _message, onChunkReceived) => {
        const streamId = `stream-${global.crypto.randomUUID()}`;
        return streamId;
      }
    );
    mockChatService.fetchSessions.mockResolvedValue([]);
  });

  test('renders without crashing', () => {
    render(<ChatPage />);
    expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
    expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
  });

  describe('Conversation Selection and Message Fetching', () => {
    const mockMessages: ChatMessage[] = [
      { id: 'msg1', text: 'Hello from session1', sender: 'user', timestamp: new Date().toISOString() },
      { id: 'msg2', text: 'Hi there from session1', sender: 'agent', timestamp: new Date().toISOString() },
    ];

    test('fetches and displays messages when a conversation is selected', async () => {
      mockChatService.fetchSessionMessages.mockResolvedValue(mockMessages);
      render(<ChatPage />);

      // Simulate selecting a conversation by clicking the button in the mocked ConversationList
      fireEvent.click(screen.getByText('Select Session 1'));

      await waitFor(() => {
        expect(mockChatService.fetchSessionMessages).toHaveBeenCalledWith('session1');
      });

      // Check if messages are passed to ChatInterface (mockChatInterface captures props)
      await waitFor(() => {
         // Last call to mockChatInterfaceFn, check its props
        const lastProps = mockChatInterfaceFn.mock.calls[mockChatInterfaceFn.mock.calls.length - 1][0];
        expect(lastProps.messages).toEqual(mockMessages);
      });

      // Also check if messages are rendered by the mock
      expect(screen.getByText('Hello from session1')).toBeInTheDocument();
      expect(screen.getByText('Hi there from session1')).toBeInTheDocument();
    });

    test('displays loading state while fetching messages', async () => {
      // Create a promise that doesn't resolve immediately
      let resolveFetch: (value: ChatMessage[]) => void;
      mockChatService.fetchSessionMessages.mockImplementationOnce(
        () => new Promise(resolve => { resolveFetch = resolve; })
      );
      render(<ChatPage />);

      fireEvent.click(screen.getByText('Select Session 1'));

      await waitFor(() => {
        expect(screen.getByText('Loading messages...')).toBeInTheDocument();
      });

      // Resolve the promise to complete the test
      await act(async () => {
        resolveFetch([]);
      });
    });

    test('displays error state if fetching messages fails', async () => {
      mockChatService.fetchSessionMessages.mockRejectedValueOnce(new Error('Failed to fetch'));
      render(<ChatPage />);
      fireEvent.click(screen.getByText('Select Session 1'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch messages. Failed to fetch');
      });
    });
  });

  describe('Sending Messages (including Streaming)', () => {
    const activeSessionId = 'session1';

    test('optimistically displays user message and calls sendMessage', async () => {
      render(<ChatPage />);
      // First, select a conversation to set activeConversationId
      fireEvent.click(screen.getByText('Select Session 1'));
      await waitFor(() => expect(mockChatService.fetchSessionMessages).toHaveBeenCalled());


      // Simulate ChatInterface sending a message
      fireEvent.click(screen.getByText('Send')); // Uses "Test user message" from mockChatInterface

      // Check for optimistic user message
      // The mockChatInterface will re-render with new messages.
      // Need to wait for the state update in ChatPage that adds the user message.
      await waitFor(() => {
        expect(screen.getByText('Test user message')).toBeInTheDocument();
      });

      expect(mockChatService.sendMessage).toHaveBeenCalledWith(
        activeSessionId,
        expect.objectContaining({ text: 'Test user message', sender: 'user' }),
        expect.any(Function) // onChunkReceived callback
      );
    });

    test('progressively renders streaming agent response', async () => {
      let capturedOnChunkReceived: (chunk: string, isLastChunk: boolean, streamId: string) => void;
      const streamId = 'test-stream-id-123';

      mockChatService.sendMessage.mockImplementationOnce(
        async (_sessionId, _message, onChunkReceived) => {
          capturedOnChunkReceived = onChunkReceived;
          return streamId; // Return the streamId immediately
        }
      );

      render(<ChatPage />);
      fireEvent.click(screen.getByText('Select Session 1')); // Activate session
      await waitFor(() => expect(mockChatService.fetchSessionMessages).toHaveBeenCalled());

      fireEvent.click(screen.getByText('Send')); // Send user message

      await waitFor(() => expect(mockChatService.sendMessage).toHaveBeenCalled());

      // Simulate receiving chunks
      await act(async () => {
        capturedOnChunkReceived('Agent says: Hello', false, streamId);
      });
      await waitFor(() => {
        expect(screen.getByText('Agent says: Hello (streaming...)')).toBeInTheDocument();
      });

      await act(async () => {
        capturedOnChunkReceived(' world!', false, streamId);
      });
      await waitFor(() => {
        expect(screen.getByText('Agent says: Hello world! (streaming...)')).toBeInTheDocument();
      });

      await act(async () => {
        capturedOnChunkReceived(' Stream ends.', true, streamId);
      });
      await waitFor(() => {
        // Streaming indicator should be gone
        expect(screen.getByText('Agent says: Hello world! Stream ends.')).toBeInTheDocument();
        expect(screen.queryByText('(streaming...)')).not.toBeInTheDocument();
      });
       // Check that ChatInterface's isLoading prop (which ChatPage maps from its isStreaming state) is false
       const lastProps = mockChatInterfaceFn.mock.calls[mockChatInterfaceFn.mock.calls.length - 1][0];
       expect(lastProps.isLoading).toBe(false); // ChatPage uses isLoading for fetch, isStreaming for send.
                                            // The mockChatInterface displays "Loading messages..." for isLoading.
                                            // Let's assume ChatPage should pass its `isStreaming` state as a prop like `isMessageStreaming`
                                            // or ChatInterface should differentiate.
                                            // For now, ChatPage's `isStreaming` state is internal.
                                            // The test checks the text, which is the primary concern.
    });

    test('handles error during sendMessage/streaming', async () => {
      mockChatService.sendMessage.mockRejectedValueOnce(new Error('Stream failed'));
      render(<ChatPage />);
      fireEvent.click(screen.getByText('Select Session 1'));
      await waitFor(() => expect(mockChatService.fetchSessionMessages).toHaveBeenCalled());

      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Failed to send message. Stream failed');
      });
    });
  });
});

// Helper for act with async calls if needed, React Testing Library's act usually handles it.
// const act = ReactTestingLibrary.act; // if not auto-imported or for specific uses.
// For these tests, RTL's `waitFor` and `fireEvent` often wrap updates in `act` sufficiently.
// Explicit `act` is used above for `onChunkReceived` calls to ensure state updates are processed.
import { act as rtlAct } from '@testing-library/react'; // Renaming to avoid conflict if any
const act = rtlAct; // Use this alias for clarity if preferred

// Note: The mock for ChatInterface passes isLoading and error.
// ChatPage has `isLoading` (for message list fetching) and `isStreaming` (for message sending).
// The ChatInterface mock currently uses `props.isLoading` to display "Loading messages...".
// This test suite doesn't explicitly check the `isStreaming` prop on ChatInterface as it's not passed directly.
// The `(streaming...)` text in the message itself is the primary check for streaming UI.
// A more complete test might involve ChatInterface exposing a prop like `isSending` or `isAgentResponding`.
// For now, the provided tests cover the core logic of ChatPage.
