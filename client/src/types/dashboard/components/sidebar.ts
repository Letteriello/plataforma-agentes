import { NavItem } from './header'

/**
 * Props do componente DashboardSidebar
 */
export interface DashboardSidebarProps {
  /** Itens do menu de navegação */
  navItems: NavItem[]

  /** Indica se a barra lateral está recolhida */
  collapsed?: boolean

  /** Função chamada quando a barra lateral é recolhida/expandida */
  onCollapse?: (collapsed: boolean) => void

  /** Classe CSS adicional */
  className?: string

  /** Logo da aplicação */
  logo?: {
    /** Texto ou elemento JSX para o logo */
    content: React.ReactNode
    /** URL para redirecionamento ao clicar no logo */
    href?: string
  }

  /** Rodapé da barra lateral */
  footer?: {
    /** Conteúdo do rodapé */
    content: React.ReactNode
    /** Classe CSS adicional para o rodapé */
    className?: string
  }

  /** Versão da aplicação */
  version?: string

  /** Indica se deve mostrar a versão */
  showVersion?: boolean
}
