import { createElement, updateElement } from '../VDom'
import { VNode, VNodeProps, IComponentOptions, CompFunc, OnMountCallback } from '../types'

export class LegotComponent extends HTMLElement {
  #renderCallback?: () => VNode
  #shadowRoot: ShadowRoot
  #styles?: HTMLStyleElement
  #props = {}
  #children: any[] = []
  #states = new Map()
  #vNode?: VNode
  #onUpdateCallback?: () => void
  #onMountEffect?: Function
  #componentFunction: CompFunc
  #unMountEffectRef: OnMountCallback

  constructor(options: IComponentOptions, compFunc: CompFunc, unmountEffectRef: () => void) {
    super()
    this.#shadowRoot = this.attachShadow(options)
    this.render = this.render.bind(this)
    this.setStyles = this.setStyles.bind(this)
    this.setProps = this.setProps.bind(this)
    this.getProps = this.getProps.bind(this)
    this.setChildren = this.setChildren.bind(this)
    this.getChildren = this.getChildren.bind(this)
    this.createState = this.createState.bind(this)
    this.getShadowRoot = this.getShadowRoot.bind(this)
    this.update = this.update.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onMount = this.onMount.bind(this)

    this.#componentFunction = compFunc
    this.#unMountEffectRef = unmountEffectRef
  }
  // built-in
  connectedCallback() {
    this.#componentFunction(this)
    this.#unMountEffectRef = this.#onMountEffect?.()
  }
  disconnectedCallback() {
    this.#unMountEffectRef?.()
  }
  // end- built-in
  onMount(callback: OnMountCallback) {
    this.#onMountEffect = callback
  }
  render(callback?: () => VNode) {
    this.#renderCallback = callback
    this.#vNode = callback?.()
    if (this.#vNode) {
      if (this.#styles) {
        this.#shadowRoot.replaceChildren(this.#styles, createElement(this.#vNode))
      } else {
        this.#shadowRoot.replaceChildren(createElement(this.#vNode))
      }
    }
  }
  update() {
    this.#onUpdateCallback?.()
    const callback = this.#renderCallback
    if (!callback) {
      throw 'invalid render callback function'
    }
    const oldVnode = this.#vNode
    const newNode = callback?.()

    this.#vNode = updateElement(this.#shadowRoot, oldVnode, newNode)
  }
  onUpdate(callback: () => void) {
    this.#onUpdateCallback = callback
  }

  setStyles(styles: string) {
    if (this.#styles instanceof HTMLStyleElement) {
      this.#styles.textContent = styles
    } else {
      const styleEl = document.createElement('style')
      styleEl.textContent = styles
      this.#styles = styleEl
      this.#shadowRoot.prepend(styleEl)
    }

    return this.#styles.sheet
  }
  setProps(props: VNodeProps) {
    this.#props = props
  }
  getProps<T>() {
    return this.#props as T
  }
  setChildren(children: any) {
    this.#children = children
  }
  getChildren() {
    return this.#children
  }

  createState<T>(initValue: T): [() => T, (newState: T) => void] {
    const component = this

    const stateRef = Symbol()
    this.#states.set(stateRef, initValue)

    const setState = (newState: T) => {
      component.#states.set(stateRef, newState)
      component.update()
    }
    const getState = () => component.#states.get(stateRef)

    return [getState, setState]
  }
  getShadowRoot() {
    return this.#shadowRoot
  }
}
