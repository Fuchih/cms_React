import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/Login'
import NewsSandBox from '../views/NewsSandBox'

export default function MyRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route
          path="/"
          render={() => (localStorage.getItem('token') ?
          <NewsSandBox></NewsSandBox> :
          <Redirect to="/login" />)}
        />
      </Switch>
    </HashRouter>
  )
}
