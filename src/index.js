// @flow
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.css'
import DevTools from './salt/DevTools'
import UITest from './salt/ui/Test'

const root = document.getElementById('root')
if (root != null) {
  ReactDOM.render(<DevTools overlays={[ UITest ]} />, root)
} else {
  throw new Error('No root element found.')
}
