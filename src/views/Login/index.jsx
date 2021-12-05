import { withRouter } from 'react-router'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Particles from 'react-tsparticles'
import axios from 'axios'
import './index.scss'

function Login(props) {
  function onFinish(value) {
    const { username, password } = value
    axios.get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`).then((res) => {
      if (res.data.length === 0) message.error('Oops! Wrong Username or Password')
      else {
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        props.history.push('/')
      }
    })
  }

  return (
    <div style={{ backgroundColor: 'rgb(35, 39, 65)', height: '100vh' }}>
      <Particles
        options={{
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'repulse'
              },
              resize: true
            }
          },
          particles: {
            color: {
              value: '#ffffff'
            },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1
            },
            collisions: {
              enable: true
            },
            move: {
              direction: 'none',
              enable: true,
              outMode: 'bounce',
              random: false,
              speed: 6,
              straight: false
            },
            number: {
              density: {
                enable: true,
                value_area: 800
              },
              value: 80
            }
          }
        }}
      />
      <Form className="form-container" onFinish={onFinish}>
        <h1 className="login-title">Global News</h1>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default withRouter(Login)
