import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Exemplo mínimo de ThemeProvider para integração futura com Tailwind e controle de tema
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Aqui pode ser expandido para alternância de tema (claro/escuro) usando contexto
  return <>{children}</>;
}
