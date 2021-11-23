import { useState } from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)

  function changeCollapsed() {
    setCollapsed(!collapsed)
  }

  const menu = (
    <Menu>
      <Menu.Item>Admin</Menu.Item>
      <Menu.Item danger>Sign out</Menu.Item>
    </Menu>
)

  return (
    <Header className="site-layout-background" style={{ padding:  '0 16px' }}>
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>
      }
      <div style={{float:'right'}}>
        <span>Welcome back Admin</span>
        <Dropdown overlay={menu}>
          <Avatar shape="square" size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
