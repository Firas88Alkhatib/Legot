import { LegotComponent } from '../Lib/LegotComponent'
import { VNode, IElementVNode, ITextVNode } from '../types'
import { isEvent, getEventName } from '../Utils'

const createComponent = (vNode: IElementVNode) => {
  const webComponent = document.createElement(vNode.tagName)

  if (webComponent instanceof LegotComponent) {
    webComponent.setProps(vNode.props)
    webComponent.setChildren(vNode.children)
  }
  vNode.realNode = webComponent
  return webComponent
}

/**
 * Creates HTMLElement
 * - set it's attributes
 * - set it's eventListeners
 * - update VNode's listeners array
 *
 * and finally returns the element
 */
const createHTMLElement = (vNode: IElementVNode) => {
  // todo use AbortController instead of keeping references of the eventListeners? compatibility ?
  const { tagName, props } = vNode
  const element = document.createElement(tagName)

  Object.entries(props).forEach(([key, value]) => {
    if (isEvent(key)) {
      const eventName = getEventName(key)
      const eventHandler = (event: any) => value(event, element)
      element.addEventListener(eventName, eventHandler)
      vNode.listeners[eventName] = eventHandler
    } else {
      element.setAttribute(key, value)
    }
  })
  vNode.realNode = element
  return element
}

/**
 * Create namespace Element and assign the namespace all it's children
 */
const createNS = (vNode: IElementVNode, nameSpace: string) => {
  const { tagName, props } = vNode
  const children = vNode.children
  const elementNs = document.createElementNS(nameSpace, tagName)
  Object.entries(props).forEach(([key, value]) => {
    elementNs.setAttribute(key, value)
  })
  children.forEach((child) => {
    if (child.type === 'text') {
      elementNs.appendChild(createTextNode(child))
    } else {
      elementNs.appendChild(createNS(child, nameSpace))
    }
  })
  vNode.realNode = elementNs
  return elementNs
}
const createTextNode = (vNode: ITextVNode) => {
  const textNode = document.createTextNode(vNode.value)
  vNode.realNode = textNode
  return textNode
}

/**
 * Creates HTMLElement , Namespace Element, TextNode or WebComponent
 * recursively with all their childrens and props
 * - also sets EventListeners if the prop name is "on" followed by capital letter e.g "onClick" in case of HTMLElement
 */
export const createElement = (vNode: VNode) => {
  if (vNode.type === 'text') return createTextNode(vNode)
  if (vNode.tagName.includes('-')) return createComponent(vNode)
  if (vNode.props.xmlns) return createNS(vNode, vNode?.props?.xmlns)

  const element = createHTMLElement(vNode)
  vNode.children.forEach((child) => {
    element.appendChild(createElement(child))
  })

  return element
}
