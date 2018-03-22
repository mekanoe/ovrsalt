// @flow
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import UITest from './Test'

const root = document.getElementById('root')
if (root !== null) {
  ReactDOM.render(<UITest />, root)
} else {
  throw new Error('No root element found.')
}
