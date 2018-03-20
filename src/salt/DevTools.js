// @flow

import * as React from 'react'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'

type Props = {
  overlays: {
    [string]: React.Component<any, any>
  }
}

/**
 * SaltDevTools provides a web UI for developing Salt overlays.
 */
export default class SaltDevTools extends React.Component<Props> {
  render () {
    const overlays: Array<[string, React.Component<any, any>]> =
      Object.keys(this.props.overlays).map(k => [ k, this.props.overlays[k] ])

    return <div>
      <BrowserRouter>
        <div>
          <nav style={{ flex: 1 }}>
            <div className='header'>Overlays:</div>
            {
              overlays.map(([name]) => <NavLink key={name} to={`/${name}`} activeClassName='current'>{name}</NavLink>)
            }
          </nav>
          <Switch>
            {
              overlays.map(([name, Overlay]) => <Route key={name} path={`/${name}`} render={() => <Overlay />} />)
            }
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  }
}
