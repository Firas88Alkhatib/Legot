import { ITextVNode, IElementVNode, VNode } from '../types'
import { isElementNode, isValidForRender, isEvent, getEventName } from '../Utils'
import { createElement } from './createElement'
import { LegotComponent } from '../Lib/LegotComponent'

export const updateElement = (parent: Element | ShadowRoot, oldVNode?: VNode, newVNode?: VNode): VNode | undefined => {
  const currentElement = oldVNode?.realNode

  if (oldVNode && !oldVNode.realNode) {
    throw 'old node exist, but no realNode attached on update !!!'
  }

  // add
  if (newVNode && !oldVNode) {
    parent.appendChild(createElement(newVNode)) // todo use insertBefore instead ? https://developer.mozilla.org/en-US/docs/web/api/node/insertbefore
    return newVNode
  }
  if (!isValidForRender(currentElement)) {
    console.warn('skip update because the current DOM Node is neither an Element nor a Text node ( or undefined ) ')
    return
  }

  if (oldVNode && !newVNode) {
    // remove
    currentElement.remove()
    return
  }

  // update
  if (oldVNode && newVNode) {
    // handle string
    if (oldVNode.type === 'text' || newVNode.type === 'text') {
      if (oldVNode.type === 'text' && newVNode.type === 'text') {
        // compare strings
        if (oldVNode.value !== newVNode.value) {
          updateString(currentElement as Text, newVNode)
        } else {
          newVNode.realNode = currentElement as Text
        }
      } else {
        const newElement = createElement(newVNode)
        currentElement.replaceWith(newElement)
        newVNode.realNode = newElement
        return newVNode
      }
      return newVNode
    }

    // check if the current element is not a text
    if (!isElementNode(currentElement)) {
      console.log("currentElement is not an 'Element' , skip updateHtmlElement !", currentElement)
      return newVNode
    }
    // handle Legot component

    if (currentElement instanceof LegotComponent) {
      return updateComponent(currentElement, oldVNode, newVNode)
    }
    updateHtmlElement(currentElement, oldVNode, newVNode)

    // recursive children
    const newLength = newVNode?.children?.length
    const oldLength = oldVNode?.children?.length

    const looptimes = newLength > oldLength ? newLength : oldLength
    for (let i = 0; i < looptimes; i++) {
      updateElement(currentElement, oldVNode.children[i], newVNode.children[i])
    }
  }
  return newVNode
}

const updateString = (element: Text, newVNode: ITextVNode) => {
  element.nodeValue = newVNode.value
  newVNode.realNode = element
}
const updateComponent = (component: LegotComponent, oldVNode: IElementVNode, newVNode: IElementVNode) => {
  if (oldVNode.tagName !== newVNode.tagName) {
    const newComponent = createElement(newVNode)
    component.replaceWith(newComponent)
    newVNode.realNode = newComponent
  } else {
    // todo check props and type before call update
    component.setProps(newVNode.props)
    component.setChildren(newVNode.children)
    component.update()
    newVNode.realNode = component
  }
  return newVNode
}

const updateHtmlElement = (element: Element, oldVNode: IElementVNode, newVNode: IElementVNode) => {
  if (oldVNode.tagName !== newVNode.tagName) {
    const newNode = createElement(newVNode)
    element.replaceWith(newNode)
    newVNode.realNode = newNode
  } else {
    updateProps(element, oldVNode, newVNode)
    newVNode.realNode = element
  }
}

const updateProps = (element: Element, oldVNode: IElementVNode, newVNode: IElementVNode) => {
  const newPropsKeys = Object.keys(newVNode.props)
  const oldPropsKeys = Object.keys(oldVNode.props)
  Object.entries(oldVNode.props).forEach(([key, value]) => {
    // remove attribute/listeners
    if (!newPropsKeys.includes(key)) {
      if (isEvent(key)) {
        const eventName = getEventName(key)
        element.removeEventListener(eventName, oldVNode.listeners[eventName])
      } else {
        element.removeAttribute(key)
      }
      return
    }
    // updated attribute/listeners
    if (newVNode.props[key] != value) {
      if (isEvent(key)) {
        const eventName = getEventName(key)
        element.removeEventListener(eventName, oldVNode.listeners[eventName])
        const eventHandler = (event: any) => value(event, element)
        element.addEventListener(eventName, eventHandler)
        newVNode.listeners[eventName] = eventHandler
      } else {
        element.setAttribute(key, newVNode.props[key])
      }
    }
  })
  // add attribute/listeners
  Object.entries(newVNode.props).forEach(([key, value]) => {
    if (!oldPropsKeys.includes(key)) {
      if (isEvent(key)) {
        const eventName = getEventName(key)
        const eventHandler = (event: any) => value(event, element)
        element.addEventListener(eventName, eventHandler)
        newVNode.listeners[eventName] = eventHandler
      } else {
        element.setAttribute(key, value)
      }
    }
  })
}
