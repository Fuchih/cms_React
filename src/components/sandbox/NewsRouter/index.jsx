import { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from '../../../views/NewsSandBox/Home'
import UserList from '../../../views/NewsSandBox/user-manage/UserList'
import RoleList from '../../../views/NewsSandBox/right-manage/RoleList'
import RightList from '../../../views/NewsSandBox/right-manage/RightList'
import NoPermission from '../../../views/NewsSandBox/NoPermission'
import NewsAdd from '../../../views/NewsSandBox/news-manage/NewsAdd'
import NewsDraft from '../../../views/NewsSandBox/news-manage/NewsDraft'
import NewsCategory from '../../../views/NewsSandBox/news-manage/NewsCategory'
import Audit from '../../../views/NewsSandBox/audit-manage/Audit'
import AuditList from '../../../views/NewsSandBox/audit-manage/AuditList'
import Unpublished from '../../../views/NewsSandBox/publish-manage/Unpublished'
import Published from '../../../views/NewsSandBox/publish-manage/Published'
import Offline from '../../../views/NewsSandBox/publish-manage/Offline'
import axios from 'axios';

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/offline": Offline,
}

export default function NewsRouter() {
  const [backRouteList, setBackRouteList] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8000/rights`),
      axios.get(`http://localhost:8000/children`),
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  function checkRoute(item) {
    return LocalRouterMap[item.key] && item.pagePermission
  }

  function checkUserPermission(item) {
    const { role:{ rights } } = JSON.parse(localStorage.getItem('token'))
    return rights.includes(item.key)
  }

  return (
    <Switch>
      {
        backRouteList.map(item => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
          }
          return null
        })
      }
      <Redirect from="/" to="/home" exact />
      {
        backRouteList.length > 0 && <Route path="*" component={NoPermission} />
      }
    </Switch>
  )
}
