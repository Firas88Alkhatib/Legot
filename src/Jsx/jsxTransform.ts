import { VNode, VNodeProps, ITextVNode } from '../types'
export const jsxTransform = (tagName: string, props: VNodeProps, ...childNodes: (string | VNode)[]): VNode => {
  const children = childNodes.map((child) => {
    return typeof child === 'string' || typeof child === 'number'
      ? ({ type: 'text', value: '' + child, realNode: undefined } as ITextVNode)
      : child
  })
  const vNode: VNode = { type: 'element', tagName, props: props || {}, children, listeners: {} }
  return vNode
}
