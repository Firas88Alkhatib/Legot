import { createElement } from '../VDom'
import { LegotComponent } from './LegotComponent'
import { VNode, IComponentOptions, CompFunc, ComponentName } from '../types'
export let componentsStore: { name: string; component: any }[] = []

const DEFAULT_SHADOW_DOM_OPTIONS: IComponentOptions = {
  mode: 'closed',
  delegatesFocus: false,
}

const createFarsoClass = (compoFunc: CompFunc, options: IComponentOptions = DEFAULT_SHADOW_DOM_OPTIONS) => {
  let unMountEffect: () => void
  return class TComponent extends LegotComponent {
    constructor() {
      super(options, compoFunc, unMountEffect)
    }
  }
}

export const defineComponent = (componentName: ComponentName, compoFunc: CompFunc, options?: IComponentOptions) => {
  if (!componentName) throw 'Invalid component name'
  if (customElements.get(componentName)) throw `Component with the name "${componentName}" already defined`

  const ComponentClass = createFarsoClass(compoFunc, options)

  customElements.define(componentName, ComponentClass)

  componentsStore.push({ name: componentName, component: ComponentClass })
}

export const initApp = (parent: Element, app: VNode) => {
  parent.replaceChildren(createElement(app))
}
