import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Futuro: enviar log para serviço externo
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 bg-red-100 text-red-800 rounded">
          <h2 className="font-bold text-lg mb-2">
            Ocorreu um erro inesperado.
          </h2>
          <pre className="whitespace-pre-wrap text-xs">
            {this.state.error?.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
