import type { LegotComponent } from './Lib/LegotComponent'
export type VNodeListeners = Record<string, (event?: any) => any>
export type VNodeProps = Record<string, any>

export interface ITextVNode {
  type: 'text'
  value: string
  realNode?: Text
}
export interface IElementVNode {
  type: 'element'
  tagName: string
  props: VNodeProps
  children: VNode[]
  listeners: VNodeListeners
  realNode?: Element | Text
}
export type VNode = ITextVNode | IElementVNode

export interface IComponentOptions {
  mode: 'closed' | 'open'
  delegatesFocus?: boolean
}

export type ComponentName = `${string}-${string}`
export type CompFunc = (component: LegotComponent) => void

export type AsyncOnMountCallback = () => Promise<void | (() => void)>
export type SyncOnMounCallback = () => void | (() => void)
export type OnMountCallback = AsyncOnMountCallback | SyncOnMounCallback
