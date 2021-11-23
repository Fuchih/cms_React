import React from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './index.css'

const { Sider } = Layout
const { SubMenu } = Menu
const menuList = [
  {
    key: '/home',
    title: 'Home',
    icon: <UserOutlined />
  },
  {
    key: '/user-manage',
    title: 'User Management',
    icon: <UserOutlined />,
    children: [
      {
        key: '/user-manage/list',
        title: 'User List',
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: '/right-manage',
    title: 'Managing Auth',
    icon: <UserOutlined />,
    children: [
      {
        key: '/right-manage/role/list',
        title: 'Role List',
        icon: <UserOutlined />
      },
      {
        key: '/right-manage/right/list',
        title: 'Authority List',
        icon: <UserOutlined />
      }
    ]
  }
]

function SideMenu(props) {
  function renderMenu(menuList) {
    return menuList.map((item) => {
      if (item.children) {
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        )
      }

      return (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={() => {
            props.history.push(item.key)
          }}
        >
          {item.title}
        </Menu.Item>
      )
    })
  }

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className="logo">News Publishing Platform</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        {renderMenu(menuList)}
      </Menu>
    </Sider>
  )
}

export default withRouter(SideMenu)
