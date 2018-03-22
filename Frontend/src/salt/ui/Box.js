// @flow
import * as React from 'react'
import { BoxStyle, defaultStyle, withColor } from './BoxStyle'
import PIXIComponent from '../PIXIComponent'
import { Graphics } from 'pixi.js'
import { Point, Size } from '../types'
// import type { ReactChild } from 'react'

type BoxProps = {
  style?: BoxStyle,
  // is the point given centered?
  center?: boolean,
  // this should probably be a Box, but since it's not defined yet..
  parent?: PIXIComponent<BoxProps> & { contentDimensions: Point & Size },
  x: number,
  y: number,
  width: number,
  height: number,
  children?: React.Node
}

/**
 * Box is a primitive UI element that handles most of the styling capabilities.
 * It's almost CSS. But it's not.
 */
export default class Box extends PIXIComponent<BoxProps> {
  contentDimensions: Point & Size = { x: 0, y: 0, width: 0, height: 0 }

  DisplayObject = Graphics
  behavior (o: Graphics, oldProps: BoxProps, props: BoxProps) {
    o.clear()

    o.beginFill(0)
    o.endFill()

    // default the style if it's not there.
    const {
      x,
      y,
      width,
      height,
      style = defaultStyle,
      center = false,
      parent
    } = props

    const round = style.roundness > 0

    let ox: number = x
    let oy: number = y

    // center breakout
    if (center) {
      const cd = this.calculateCenterDraw(x, y, width, height)
      ox = cd.x
      oy = cd.y
    }

    // positioning adjustment.
    if (parent != null) {
      style.positioning = style.positioning || 'content'

      if (style.positioning === 'content') {
        // if it's content, we go based on parent's content box.
        ox += parent.contentDimensions.x
        oy += parent.contentDimensions.y
      } else if (style.positioning === 'parent') {
        // if it's parent, we go based on parent's exact position.
        // this ignores padding.
        ox += parent.props.x
        oy += parent.props.y
      }
    }

    // margins
    style.margin = style.margin || 0
    ox += style.margin
    oy += style.margin

    // border render
    if (style.border != null && style.border.width > 0) {
      withColor(o, style.border.color, () => {
        const bw = style.border.width
        if (round) {
          o.drawRoundedRect(ox - bw, oy - bw, width + (bw * 2), height + (bw * 2), style.roundness + bw - 1)
        } else {
          o.drawRect(ox - bw, oy - bw, width + (bw * 2), height + (bw * 2))
        }
      })
    }

    // top render
    // if we're rounding, we'll use rounded rects, otherwise not.
    withColor(o, style.background, () => {
      if (round === true) {
        o.drawRoundedRect(ox, oy, width, height, style.roundness)
      } else {
        o.drawRect(ox, oy, width, height)
      }
    })

    // because we inject some stuff into children, we give it a helper.
    style.padding = style.padding || 0
    this.contentDimensions = {
      x: ox + style.padding,
      y: oy + style.padding,
      width: width - style.padding,
      height: height - style.padding
    }
  }

  calculateCenterDraw (x: number, y: number, w: number, h: number): Point {
    return {
      x: x - Math.round(w * 0.5),
      y: y - Math.round(h * 0.5)
    }
  }

  render () {
    const { InjectedComponent, props: { children, ...props } } = this

    const propInjectedChildren = children != null
      ? React.Children.map(
        children,
        child => React.cloneElement(child, {
          parent: this
        }))
      : null

    return <React.Fragment>
      <InjectedComponent {...props} />
      { propInjectedChildren }
    </React.Fragment>
  }

  // helper methods for future stuff.
  extension (displayObject: Graphics, oldProps: BoxProps, props: BoxProps) {}
}
