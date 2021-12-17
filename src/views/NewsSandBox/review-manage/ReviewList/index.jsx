import axios from 'axios'
import { useState, useEffect } from 'react'
import { Table, Button, Tag, notification } from 'antd'

export default function ReviewList(props) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    // _ne不等於 _lte小等於 _gte大等於
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => setDataSource(res.data))
  }, [username])

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
      title: 'State',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['gray', 'orange', 'green', 'red']
        const auditStateList = ['Draft', 'Reviewing', 'Approval', 'Denial']
        return <Tag color={colorList[auditState]}>{auditStateList[auditState]}</Tag>
      }
    },
    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            {item.auditState === 1 && <Button onClick={() => handleWithdraw(item)}>Withdraw</Button>}
            {item.auditState === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                Publish
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                Update
              </Button>
            )}
          </>
        )
      }
    }
  ]

  function handleWithdraw(item) {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios
      .patch(`/news/${item.id}`, {
        auditState: 0
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `Save to Draft`,
          placement: 'bottomRight'
        })
      })
  }

  function handleUpdate(item) {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  function handlePublish(item) {
    axios
      .patch(`/news/${item.id}`, {
        "publishState": 2
      })
      .then((res) => {
        props.history.push('/publish-manage/published')

        notification.info({
          message: `Notification`,
          description: `Publishing / Published`,
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
