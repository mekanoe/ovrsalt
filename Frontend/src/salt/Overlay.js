// @flow
import * as React from 'react'
import { MemoryRouter } from 'react-router'
import { Stage } from 'react-pixi-fiber'
import type { StageProperties } from 'react-pixi-fiber'

export type OverlayProps = StageProperties & {
  children: any
}

export default class Overlay extends React.Component<OverlayProps> {
  render () {
    const {
      children,
      ...stageProps
    } = this.props

    return <MemoryRouter>
      <Stage {...stageProps}>
        {children}
      </Stage>
    </MemoryRouter>
  }
}
