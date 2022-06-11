/**
 * checks if a prop is prefixed with "on" followed by capital letter
 */
export const isEvent = (propName: string) => {
  return /^on[A-Z]/.test(propName)
}

/**
 * converts "onClick" to "click"
 */

export const getEventName = (propName: string) => {
  return propName.substring(2).toLowerCase()
}

/**
 * Checks if a ChildNode is an Element
 *
 * refer to : https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
 */
export const isElementNode = (node: Node): node is Element => {
  return node.nodeType === Node.ELEMENT_NODE
}
export const isTextNode = (node: Node): node is Text => {
  return node.nodeType === Node.TEXT_NODE
}

/**
 * Checks if the node is valid for update or render
 */
export const isValidNode = (node: Node): node is Element | Text => {
  return isElementNode(node) || isTextNode(node)
}

/**
 * Checks if the given arguments (Element, newVNode and oldVNode) are valid for render or update
 */
export const isValidForRender = (domNode?: Node): domNode is Element | Text => {
  return !!domNode && isValidNode(domNode)
}
/**
 * get the prop name of a listener e.g: click=> onClick
 */
export const getListenerProp = (value: string) => {
  return 'on' + value.replace(/^\w/, (c) => c.toUpperCase())
}
