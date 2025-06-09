import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web'; // For polyfilling ReadableStream

global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(global as any).ReadableStream = ReadableStream;


import { chatService } from './chatService';
import apiClient from './apiClient';
import { ChatMessage, Session } from '@/types';
import { getApiBaseUrlFromEnv } from '../config'; // Import the original to mock it

// Mock apiClient for non-streaming methods
jest.mock('./apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock the config module
jest.mock('../config', () => ({
  getApiBaseUrlFromEnv: jest.fn(),
}));

const MOCK_API_BASE_URL = 'http://mockapi.com';

describe('chatService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (apiClient.get as jest.Mock).mockClear();
    (apiClient.post as jest.Mock).mockClear();
    (getApiBaseUrlFromEnv as jest.Mock).mockClear(); // Clear mock for the config function
    // Restore global fetch if it was spied on and altered by a specific test
    if (global.fetch && global.fetch.mockRestore) { // Check if fetch was mocked
      global.fetch.mockRestore();
    }
    // Set the mock return value for getApiBaseUrlFromEnv for each test suite or test case as needed
    (getApiBaseUrlFromEnv as jest.Mock).mockReturnValue(MOCK_API_BASE_URL);
  });

  describe('fetchSessions', () => {
    it('should fetch sessions for a user successfully', async () => {
      const userId = 'user123';
      const mockSessions: Session[] = [{ id: 'session1', agentId: 'agent1', createdAt: new Date().toISOString() }];
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockSessions });

      const result = await chatService.fetchSessions(userId);

      expect(apiClient.get).toHaveBeenCalledWith(`/api/chat/sessions?userId=${userId}`);
      expect(result).toEqual(mockSessions);
    });

    it('should throw an error if fetching sessions fails', async () => {
      const userId = 'user123';
      const errorMessage = 'Network Error';
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(chatService.fetchSessions(userId)).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchSessionMessages', () => {
    it('should fetch messages for a session successfully', async () => {
      const sessionId = 'session123';
      const mockMessages: ChatMessage[] = [
        { id: 'msg1', text: 'Hello', sender: 'user', timestamp: new Date().toISOString() },
      ];
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockMessages });

      const result = await chatService.fetchSessionMessages(sessionId);

      expect(apiClient.get).toHaveBeenCalledWith(`/api/chat/sessions/${sessionId}/messages`);
      expect(result).toEqual(mockMessages);
    });

    it('should throw an error if fetching messages fails', async () => {
      const sessionId = 'session123';
      const errorMessage = 'API Error';
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(chatService.fetchSessionMessages(sessionId)).rejects.toThrow(errorMessage);
    });
  });

  describe('startNewSession', () => {
    it('should start a new session successfully', async () => {
      const userId = 'user123';
      const agentId = 'agent007';
      const mockNewSession: Session = { id: 'newSession', agentId, createdAt: new Date().toISOString() };
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockNewSession });

      const result = await chatService.startNewSession(userId, agentId);

      expect(apiClient.post).toHaveBeenCalledWith('/api/chat/sessions', { userId, agentId });
      expect(result).toEqual(mockNewSession);
    });

    it('should throw an error if starting a new session fails', async () => {
      const userId = 'user123';
      const agentId = 'agent007';
      const errorMessage = 'Failed to create session';
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(chatService.startNewSession(userId, agentId)).rejects.toThrow(errorMessage);
    });
  });

  describe('sendMessage (streaming)', () => {
    let mockFetch: jest.SpyInstance;
    const sessionId = 'sessionStream123';
    const userMessage: Omit<ChatMessage, 'id' | 'isStreaming' | 'streamId'> = {
      text: 'Test message',
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Helper to create a ReadableStream from an array of strings
    const createMockStream = (chunks: string[]): ReadableStream<Uint8Array> => {
      const encoder = new TextEncoder();
      let chunkIndex = 0;
      return new ReadableStream({
        pull(controller) {
          if (chunkIndex < chunks.length) {
            controller.enqueue(encoder.encode(chunks[chunkIndex]));
            chunkIndex++;
          } else {
            controller.close();
          }
        },
      });
    };

    // Helper to create a ReadableStream that errors
    const createMockErrorStream = (chunks: string[], errorAfterChunks: number, errorMessage: string): ReadableStream<Uint8Array> => {
      const encoder = new TextEncoder();
      let chunkIndex = 0;
      return new ReadableStream({
        pull(controller) {
          if (chunkIndex < errorAfterChunks) {
             controller.enqueue(encoder.encode(chunks[chunkIndex]));
             chunkIndex++;
          } else if (chunkIndex === errorAfterChunks) {
            // controller.error(new Error(errorMessage)); // This closes the stream abruptly
            // To test reader.read() throwing an error, the reader itself needs to be manipulated or the stream source needs to throw.
            // For simplicity in this mock, we'll have the reader throw, which is harder to set up here.
            // A more direct way is to have the fetch promise reject, or response.body.getReader().read() reject.
            // Let's simulate reader.read() rejecting by having a custom mock for it.
            // This is getting complex for this helper, will handle in test.
            // For now, this helper will just close after errorAfterChunks for this path.
            controller.enqueue(encoder.encode(chunks[chunkIndex])); // Send one more chunk
            chunkIndex++;
            throw new Error(errorMessage); // Simulate error during stream processing by reader
          } else {
            controller.close();
          }
        },
      });
    };


    it('should send a message and process stream successfully', async () => {
      const chunks = ['Hello', ' world', '!'];
      const mockStream = createMockStream(chunks);
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        body: mockStream,
        status: 200,
        statusText: 'OK',
      });
      // Ensure getApiBaseUrlFromEnv is mocked before this test runs (done in beforeEach)
      // (getApiBaseUrlFromEnv as jest.Mock).mockReturnValue(MOCK_API_BASE_URL);


      const onChunkReceived = jest.fn();
      const streamId = await chatService.sendMessage(sessionId, userMessage, onChunkReceived);

      expect(getApiBaseUrlFromEnv).toHaveBeenCalled(); // Verify it was called
      expect(global.fetch).toHaveBeenCalledWith(
        `${MOCK_API_BASE_URL}/api/chat/sessions/${sessionId}/messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userMessage),
        })
      );

      expect(onChunkReceived).toHaveBeenCalledTimes(chunks.length + 1); // +1 for the final empty chunk
      for (let i = 0; i < chunks.length; i++) {
        expect(onChunkReceived).toHaveBeenNthCalledWith(i + 1, chunks[i], false, streamId);
      }
      expect(onChunkReceived).toHaveBeenLastCalledWith('', true, streamId);
      expect(streamId).toMatch(/^stream-/);
    });

    it('should handle HTTP error response from fetch', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server Error Details', // mock .text() method
      });

      const onChunkReceived = jest.fn();

      await expect(chatService.sendMessage(sessionId, userMessage, onChunkReceived))
        .rejects.toThrow('HTTP error 500: Internal Server Error. Body: Server Error Details');

      // Check if onChunkReceived was called to signal stream end
      expect(onChunkReceived).toHaveBeenCalledTimes(1);
      expect(onChunkReceived).toHaveBeenCalledWith('', true, expect.stringMatching(/^stream-/));
    });

    it('should handle null response body from fetch', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            body: null, // Simulate null body
            status: 200,
            statusText: "OK"
        });

        const onChunkReceived = jest.fn();
        await expect(chatService.sendMessage(sessionId, userMessage, onChunkReceived))
            .rejects.toThrow('Response body is null');

        expect(onChunkReceived).toHaveBeenCalledTimes(1);
        expect(onChunkReceived).toHaveBeenCalledWith('', true, expect.stringMatching(/^stream-/));
    });

    it('should handle error during stream reading', async () => {
      const errorMessage = "Stream read error";
      // Mock reader.read() to throw an error
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ value: new TextEncoder().encode("First chunk"), done: false })
          .mockRejectedValueOnce(new Error(errorMessage)), // Error on second read
        releaseLock: jest.fn(), // Ensure releaseLock is defined
      };
      const mockStream = {
        getReader: () => mockReader,
      } as unknown as ReadableStream<Uint8Array>; // Type assertion

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        body: mockStream,
        status: 200,
        statusText: 'OK',
      });

      const onChunkReceived = jest.fn();

      await expect(chatService.sendMessage(sessionId, userMessage, onChunkReceived))
        .rejects.toThrow(errorMessage);

      // onChunkReceived should be called for the first successful chunk
      expect(onChunkReceived).toHaveBeenCalledWith("First chunk", false, expect.stringMatching(/^stream-/));
      // And then called again to signal the end of the stream due to error
      expect(onChunkReceived).toHaveBeenLastCalledWith('', true, expect.stringMatching(/^stream-/));
      expect(onChunkReceived).toHaveBeenCalledTimes(2);
    });
  });
});
