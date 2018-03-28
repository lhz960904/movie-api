import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
import routes from './routes/index'
import 'antd/dist/antd.css'
import './assets/common.css'

export default () => (
  <Switch>
    {
      routes.map(({name, path, exact = true, component}) => (
        <Route path={path} exact={exact} component={component} key={name} />
      ))
    }
  </Switch>
)