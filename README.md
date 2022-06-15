# Legot

Legot is a JavaScript library for building web user interfaces.

Legot is Component-Based. it allows you to build encapsulated components with lifecycl, state management and encapsulated styles.
It supports JSX syntax and has Virtual DOM.

# Get started

you can create a new Legot project with zero configuration by running :

```
npm create legot
```

and follow the prompt.

## Usage

```tsx
import { defineComponent, CompFunc, initApp } from 'legot'

const HelloWorld: CompFunc = ({ render }) => {
  render(() => <div>Hello world</div>)
}

defineComponent('hello-world', HelloWorld)

const root = document.querySelector<HTMLDivElement>('#root')!
initApp(root, <hello-world />)
```

In the example above, we've defined a new component with the name `"hello-world"` and we've assigned the function `"HelloWorld"` as it's handler.

The component handler (`"HelloWorld"` function) will receive the lifecycle and state management methods etc.. as the only argument, no need to import them.

Actually Legot uses `Web Components` ( custom HTML elements ), and the component handler will receive the HTML element it self as it's only argument which includes the lifecycle, state management , props, children , parent and some other useful methods.

## Importing Components

As the `defineComponent` function handles registering our component to the CustomElementRegistry , no need to export/import our component.

Although, the `defineComponent` will not be called because the module is not imported anywhere in the application and module bundlers will cosider it as dead-code.

To handle this either we export the component handler function in every module and import them all in our application entry and call the `defineComponent` function for everyone.

or simply importing the module when we need to use the component like the following :

```tsx
// HelloWorld.tsx
import { defineComponent, CompFunc, initApp } from 'legot'

const HelloWorld: CompFunc = ({ render }) => {
  render(() => <div>Hello world</div>)
}

defineComponent('hello-world', HelloWorld)
```

```tsx
// main.tsx
import './HelloWorld'

const root = document.querySelector<HTMLDivElement>('#root')!
initApp(root, <hello-world />)
```

## Lifecycle

### render

The `render` method accepts a callback that returns the contents of the component.

```tsx
const HelloWorld: CompFunc = (component) => {
  const { render } = component
  render(() => {
    return (
      <div>
        <p>Hello World</p>
        <p>I am a component</p>
      </div>
    )
  })
}
```

### onMount

The `onMount` method accepts a callback that will be called when the component gets connected to the DOM, and it can return a function that will be called when the component gets disconnected from the DOM, this can be cosidered as the on unmount callback.
this is to make it easy to create closures and minimize the need for extra code and checking.

```tsx
const HelloWorld: CompFunc = (component) => {
  const { render, onMount } = component
  onMount(() => {
    const controller = new AbortController()
    const data = fetch('some/url', { signal: controller.signal })
    // handle the data ... //
    return () => {
      controller.abort()
    }
  })
  render(() => {
    return (
      <div>
        <p>Hello World</p>
        <p>I am a component</p>
      </div>
    )
  })
}
```

## State management

### createState

The `createState` method is used, well , to create a state!, it accpets the initial state value as argument and returns two methods in an array , the first is the get and the second is the set.
Not like other libraries, createState can be called conditionally, but not inside lifecycle methods callbacks.

```tsx
import { defineComponent, CompFunc, initApp } from 'legot'

const Counter: CompFunc = (component) => {
  const { render, createState } = component
  const [getCount, setCount] = createState(0)

  const onClickHandler = () => {
    const count = getCount()
    setCount(count + 1)
  }

  render(() => (
    <div>
      <button onClick={onClickHandler}>Increase</button>
      <p>The count is : {getCount()}</p>
    </div>
  ))
}
```

## Props, Children and Parent

use `getProps` and `getChildren` methods to get the children/props

Since the argument passed to component handler function is an Element , we can access the parent via `component.parentElement` property to get the parent

```tsx
import { defineComponent, CompFunc, initApp } from 'legot'
interface IProps {
  class: string
}
const Example: CompFunc = (component) => {
  const { render, getProps, getChildren } = component

  render(() => {
    const props = getProps<IProps>()
    const children = getChildren()
    const parentTagName = component.parentElement?.tagName
    return (
      <div class={props.class}>
        <p>My parent's tag name is : {parentTagName}</p>
        {...children}
      </div>
    )
  })
}

defineComponent('c-example', Example)

const root = document.querySelector<HTMLDivElement>('#root')!
initApp(
  root,
  <c-example>
    <p>I am a child</p>
    <p>I am another child</p>
  </c-example>
)
```

Note: the value returned by `getChildren` method is always an array, make sure to spread it!.

## Styles

### setStyles

Legot uses Shadow DOM with a closed mode to keep the styles of the component isolated from the DOM and prevent styles conflicts.

use `setStyles` method, it accepts the styles as string

```tsx
const HelloWorld: CompFunc = (component) => {
  const { render, setStyles } = component
  const styles = `
  div {
    background-color: dodgerblue;
  }
  `
  setStyles(styles)
  render(() => {
    return <div>Hello World</div>
  })
}
```

Although the above example works fine, it is recommended to have your styles in a seperate css/sass file and import them as string using module bundler's loader.

If you are using [Vite](https://vitejs.dev/) , you can suffix your css/sass import path with `"?inline"` to prevent injecting the styles to the DOM and have it as raw string instead

Note: by creating a new application using `npm create legot` command, [Vite](https://vitejs.dev/) is already the project bundler, no need for extra configuration.

```tsx
import styles from './helloWorld.css?inline'

const HelloWorld: CompFunc = (component) => {
  const { render, setStyles } = component

  setStyles(styles)

  render(() => {
    return <div>Hello World</div>
  })
}
```
