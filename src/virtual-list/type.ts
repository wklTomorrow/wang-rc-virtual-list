import { UIEvent, ReactNode } from 'react'

export type fn = (...args: any) => any

export type AutoSizeVirtualItemType = {
  top: number
  bottom: number
  height: number
  index: number
}

export type VirtualItemType = {
  height: number
  minSize?: number
  offset?: number
  scrollToTop?: number
  renderFooter?: ReactNode
  itemHeight?: number
  handleScroll?: (e: UIEvent<HTMLDivElement>) => void
  scrollToBottom?: fn
}

export type AutoVirtualItemType<T> = {
  itemKey: string
  renderItem: (params: T) => ReactNode
} & VirtualItemType
