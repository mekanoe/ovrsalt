import Color from 'color'
import { Graphics } from 'pixi.js'

export type CSSColor =
  | Color // for the fun helper color thing
  | string // for '#FFFFFF'
  | number // for 0xFFFFFF
  | null

export type BoxStyle = {
  background?: CSSColor,
  color?: CSSColor,
  padding?: number,
  margin?: number,
  roundness?: number,
  positioning?: 'content' | 'parent' | 'global',
  border?: {
    width: number,
    color: CSSColor
  }
}

export const defaultStyle: BoxStyle = {
  background: new Color('black'),
  color: new Color('#efefef'),
  padding: 0,
  margin: 0,
  roundness: 0,
  positioning: 'content',
  border: {
    width: 0,
    color: null
  }
}

export const fromColor = (c: CSSColor): Color => {
  if (!(c instanceof Color)) {
    c = new Color(c)
  }

  return c
}

export const withColor = (o: Graphics, c: CSSColor, cb: () => {}): void => {
  const color = fromColor(c)
  // console.debug('filling with', color.rgbNumber(), color.alpha())
  o.beginFill(color.rgbNumber(), color.alpha())
  cb()
  o.endFill()
}
