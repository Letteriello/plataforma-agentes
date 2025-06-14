import { rest } from 'msw'
import { server } from '@/mocks/server'
import { listAuditLogs } from '../auditLogService'

describe('auditLogService', () => {
  it('fetches logs from API', async () => {
    const mockData = [
      { id: '1', timestamp: 't', actor: { type: 'user', id: 'u1', name: 'x' }, action: 'a', details: {} },
    ]
    server.use(
      rest.get('/audit-logs', (_req, res, ctx) => {
        return res(ctx.json(mockData))
      })
    )
    const result = await listAuditLogs()
    expect(result).toEqual(mockData)
  })
})
