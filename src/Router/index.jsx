import { useEffect } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import NProgress from 'nprogress'
import Login from '../views/Login'
import NewsSandBox from '../views/NewsSandBox'
import 'nprogress/nprogress.css'

export default function MyRouter() {
  NProgress.start()

  useEffect(() => {
    NProgress.done()
  })

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
