import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.css'
import DevTools from './salt/DevTools'
import UITest from './salt/ui/Test'

ReactDOM.render(<DevTools overlays={[ UITest ]} />, document.getElementById('root'))
