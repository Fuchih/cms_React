import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/Login'
import Detail from '../views/News_Visitor/Detail'
import News from '../views/News_Visitor/News'
import NewsSandBox from '../views/NewsSandBox'

export default function MyRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/news" component={News} />
        <Route path="/detail/:id" component={Detail} />
        <Route path="/" render={() => (localStorage.getItem('token') ? <NewsSandBox></NewsSandBox> : <Redirect to="/login" />)} />
      </Switch>
    </HashRouter>
  )
}
