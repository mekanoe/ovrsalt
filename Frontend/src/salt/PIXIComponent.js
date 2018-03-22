// @flow
import * as React from 'react'
import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

type Props = {
  children?: React.Node
} & {}

// because we can do this like real adults.
export default class PIXIComponent<P, S = void> extends React.Component<Props & P, S> {
  constructor (props: Props & P) {
    super(props)
    this.InjectedComponent = CustomPIXIComponent({
      customDisplayObject: () => new this.DisplayObject(),
      customApplyProps: this.behavior != null ? this.behavior.bind(this) : undefined,
      customDidAttach: this.componentDidAttach != null ? this.componentDidAttach.bind(this) : undefined,
      customWillDetach: this.componentWillDetach != null ? this.componentWillDetach.bind(this) : undefined
    }, `PIXICustom${this.constructor.name}`)

    const origName: string = this.constructor.name || 'Component'
    this.constructor.displayName = `PIXIComponent(${this.DisplayObject.name}<${origName}>)`
  }

  InjectedComponent: Class<React.Component<*>>
  DisplayObject: Class<PIXI.DisplayObject> = PIXI.DisplayObject
  behavior (displayObject: PIXI.DisplayObject, oldProps: P, newProps: P): void {}
  componentDidAttach (displayObject: PIXI.DisplayObject): void {}
  componentWillDetach (displayObject: PIXI.DisplayObject): void {}

  render () {
    const { InjectedComponent, props: { children, ...props } } = this

    return <React.Fragment>
      <InjectedComponent {...props} />
      {children}
    </React.Fragment>
  }
}
