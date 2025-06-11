import { http, HttpResponse } from 'msw';
import type { ToolDTO } from '@/api/toolService';

const mockTools: ToolDTO[] = [
  {
    id: '1',
    name: 'get_weather',
    description: 'Get the current weather for a specific location.',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'The city and state, e.g., San Francisco, CA' },
      },
      required: ['location'],
    },
  },
  {
    id: '2',
    name: 'send_email',
    description: 'Sends an email to a recipient.',
    parameters: {
      type: 'object',
      properties: {
        recipient: { type: 'string', description: 'Email address of the recipient.' },
        subject: { type: 'string', description: 'The subject of the email.' },
        body: { type: 'string', description: 'The body content of the email.' },
      },
      required: ['recipient', 'subject', 'body'],
    },
  },
  {
    id: '3',
    name: 'google_search',
    description: 'Performs a Google search for a given query.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query.' },
      },
      required: ['query'],
    },
  },
];

export const handlers = [
  http.get('/api/tools', () => {
    return HttpResponse.json(mockTools);
  }),
];
