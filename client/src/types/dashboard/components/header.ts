import { ReactNode } from 'react'

/**
 * Item do menu de navegação
 */
export interface NavItem {
  /** Rota para navegação */
  href: string

  /** Rótulo do item */
  label: string

  /** Ícone do item */
  icon: ReactNode

  /** Indica se o item está ativo */
  active?: boolean

  /** Itens filhos (para submenus) */
  items?: NavItem[]

  /** Permissões necessárias para exibir o item */
  permissions?: string[]
}

/**
 * Props do componente DashboardHeader
 */
export interface DashboardHeaderProps {
  /** Função chamada quando o botão do menu é clicado */
  onMenuClick?: () => void

  /** Função chamada quando uma busca é realizada */
  onSearch?: (query: string) => void

  /** Função chamada quando o botão de notificações é clicado */
  onNotificationClick?: () => void

  /** Função chamada quando o botão de perfil é clicado */
  onProfileClick?: () => void

  /** Informações do usuário logado */
  user: {
    /** Nome do usuário */
    name: string

    /** Email do usuário */
    email: string

    /** URL do avatar do usuário */
    avatarUrl?: string

    /** Função chamada para fazer logout */
    onLogout?: () => void
  }

  /** Número de notificações não lidas */
  notificationCount?: number

  /** Classe CSS adicional */
  className?: string

  /** Título da página atual */
  pageTitle?: string

  /** Descrição da página atual */
  pageDescription?: string
}
