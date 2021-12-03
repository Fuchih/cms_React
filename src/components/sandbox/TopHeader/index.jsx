import { useState } from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router'

const { Header } = Layout

function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false)

  function changeCollapsed() {
    setCollapsed(!collapsed)
  }

  const { role:{ roleName }, username } = JSON.parse(localStorage.getItem('token'))

  const menu = (
    <Menu>
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item
        danger onClick={()=>{
          localStorage.removeItem('token')
          props.history.replace('/login')
        }}
      >
        Sign out
      </Menu.Item>
    </Menu>
)

  return (
    <Header className="site-layout-background" style={{ padding:  '0 16px' }}>
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>
      }
      <div style={{float:'right'}}>
        <span style={{paddingRight:'10px'}}>
          Welcome back
          <span style={{color:'#1890ff'}}> {username}</span>
        </span>
        <Dropdown overlay={menu}>
          <Avatar shape="square" size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

export default withRouter(TopHeader)
