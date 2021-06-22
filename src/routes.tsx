import { Route, Switch } from 'react-router-dom'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'

export default function Routes() {
  return (
    <Switch>
      <Route path='/' component={Home} exact />
      <Route path='/rooms/new' component={NewRoom} />
      <Route component={() => <div>Page 404</div>} />
    </Switch>
  )
}