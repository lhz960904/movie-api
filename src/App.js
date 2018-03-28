import React from 'react'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import routes from './routes/index'
import 'antd/dist/antd.css'
import './assets/common.css'

export default () => (
  <Switch>
    <Redirect from="/" to="/movie" exact/>
    {
      routes.map(({name, path, exact = true, component}) => (
        <Route path={path} exact={exact} component={component} key={name} />
      ))
    }
  </Switch>
)