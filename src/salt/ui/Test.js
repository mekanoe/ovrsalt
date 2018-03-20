// @flow
import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'

/**
 * UITest is like storybook but for us.
 */
export default class UITest extends React.Component<{||}> {
  render () {
    return <div>
      <MemoryRouter>
      </MemoryRouter>
    </div>
  }
}
