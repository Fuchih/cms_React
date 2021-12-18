import axios from 'axios'
import { useState, useEffect } from 'react'
import { Table, Button, notification } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export default function Review(props) {
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    const roleDescription = {
      1: 'admin',
      2: 'editor',
      3: 'subeditor'
    }

    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data
      setDataSource(
        roleDescription[roleId] === 'admin'
          ? list
          : [...list.filter((item) => item.author !== username), ...list.filter((item) => item.region === region && roleDescription[item.roleId] === 'subeditor')]
      )
    })
  }, [username, roleId, region])

  const columns = [
    {
      title: 'NewsTitle',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: 'Author',
      dataIndex: 'author'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            <Button type="primary" shape="circle" style={{ marginRight: '5px' }} onClick={() => handleReview(item, 2, 1)}>
              <CheckOutlined />
            </Button>
            <Button danger shape="circle" onClick={() => handleReview(item, 3, 0)}>
              <CloseOutlined />
            </Button>
          </>
        )
      }
    }
  ]

  function handleReview(item, auditState, publishState) {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState
      })
      .then(() => {
        notification.info({
          message: `Notification`,
          description: `Review`,
          placement: 'bottomRight'
        })
      })
  }

  return (
    <>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </>
  )
}
