// @flow

import * as React from 'react'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'

type Props = {
  overlays: Array<React.Component<{}>>
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
              this.props.overlays.map((O: any) => <NavLink key={O.name} to={`/${O.name}`} activeClassName='current'>{O.name}</NavLink>)
            }
          </nav>
          <Switch>
            {
              this.props.overlays.map((O: any) => {
                return <Route key={O.name} path={`/${O.name}`} render={() => <O />} />
              })
            }
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  }
}
