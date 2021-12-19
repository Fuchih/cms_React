import { Layout, Menu, Dropdown, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import './index.scss'

const { Header } = Layout

function TopHeader(props) {
  function changeCollapsed() {
    props.changeCollapsed()
  }

  const {
    role: { roleName },
    username
  } = JSON.parse(localStorage.getItem('token'))

  const menu = (
    <Menu>
      <Menu.Item key={username}>{roleName}</Menu.Item>
      <Menu.Item
        key={roleName}
        danger
        onClick={() => {
          localStorage.removeItem('token')
          props.history.replace('/login')
        }}
      >
        Sign out
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
      <div style={{ float: 'right' }}>
        <span style={{ paddingRight: '10px' }}>
          Welcome back
          <span style={{ color: '#1890ff' }}> {username}</span>
        </span>
        <Dropdown overlay={menu}>
          <Avatar shape="square" size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

function mapStateToProps({ CollapsedReducer: { isCollapsed } }) {
  return { isCollapsed }
}

const mpaDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed'
    }
  }
}

export default connect(mapStateToProps, mpaDispatchToProps)(withRouter(TopHeader))
