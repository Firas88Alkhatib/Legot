export { defineComponent, initApp, componentsStore } from './Lib/Legot'
export { jsxTransform } from './Jsx/jsxTransform'
export type { CompFunc } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
