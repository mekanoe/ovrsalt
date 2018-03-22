// @flow
import * as React from 'react'
import Overlay from '../Overlay'
import Box from './Box'

/**
 * UITest is like storybook but for us.
 */
export default class UITest extends React.Component<{||}> {
  render () {
    return <Overlay width={1024} height={576} options={{
      transparent: true,
      antialias: true,
      roundPixels: true,
      preserveDrawingBuffer: true
    }}>
      <Box
        x={2}
        y={2}
        width={1024 - 4}
        height={576 - 4}
        style={{background: '#000c09', roundness: 2, padding: 10, margin: 0, border: { width: 2, color: 'blue' }}}
      >
        <Box x={0} y={0} width={100} height={100} style={{ }} />
      </Box>
    </Overlay>
  }
}
