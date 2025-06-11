import { renderHook, act } from '@testing-library/react-hooks'
import { useDashboard } from './useDashboard'

describe('useDashboard', () => {
  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useDashboard('7d'))
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    // stats pode ser null ou objeto inicial dependendo do mock
  })

  it('deve atualizar o estado para carregado após simulação de fetch', async () => {
    jest.useFakeTimers()
    const { result, waitForNextUpdate } = renderHook(() => useDashboard('7d'))

    // Simula passagem de tempo para resolver setTimeout/fetch
    act(() => {
      jest.runAllTimers()
    })

    await waitForNextUpdate()
    expect(result.current.loading).toBe(false)
    expect(result.current.stats).not.toBeNull()
    expect(result.current.error).toBeNull()
    jest.useRealTimers()
  })

  it('deve permitir forçar refresh', async () => {
    jest.useFakeTimers()
    const { result, waitForNextUpdate } = renderHook(() => useDashboard('7d'))
    act(() => {
      jest.runAllTimers()
    })
    await waitForNextUpdate()
    act(() => {
      result.current.refresh()
      jest.runAllTimers()
    })
    await waitForNextUpdate()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    jest.useRealTimers()
  })
})
