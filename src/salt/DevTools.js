// @flow

import * as React from 'react'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'

type OverlayClass = Class<React.Component<*, *>>

type Props = {
  overlays: Array<OverlayClass>
}

/**
 * SaltDevTools provides a web UI for developing Salt overlays.
 */
export default class SaltDevTools extends React.Component<Props> {
  render () {
    return <div>
      <BrowserRouter>
        <div>
          <nav style={{ flex: 1 }}>
            <div className='header'>Overlays:</div>
            {
              this.props.overlays.map((O: OverlayClass) => <NavLink key={O.name} to={`/${O.name}`} activeClassName='current'>{O.name}</NavLink>)
            }
          </nav>
          <main>
            <Switch>
              {
                this.props.overlays.map((O: OverlayClass) => <Route key={O.name} path={`/${O.name}`} render={() => <O />} />)
              }
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    </div>
  }
}
