import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import axios from 'axios'
import { HomeOutlined, UserOutlined, KeyOutlined, FileTextOutlined, FileSearchOutlined, FileDoneOutlined } from '@ant-design/icons'
import './index.css'

const { Sider } = Layout
const { SubMenu } = Menu
const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage': <KeyOutlined />,
  '/news-manage': <FileTextOutlined />,
  '/audit-manage': <FileSearchOutlined />,
  '/publish-manage': <FileDoneOutlined />
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then((res) => {
      setMenu(res.data)
    })
    return () => {}
  }, [])

  function checkPagePermission(item) {
    return item.pagePermission
  }

  function renderMenu(menuList) {
    return menuList.map((item) => {
      // 判斷子層級有否及權限
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu
            key={item.key}
            icon={iconList[item.key]}
            title={item.title}
          >
            {renderMenu(item.children)}
          </SubMenu>
        )
      }

      return (
        checkPagePermission(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => {
              props.history.push(item.key)
            }}
          >
            {item.title}
          </Menu.Item>
        )
      )
    })
  }

  const selectKeys = [props.location.pathname]
  const openKeys = ['/' + props.location.pathname.split('/')[1]]

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="logo">News Publishing Platform</div>
        <div style={{ flex: '1', overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
