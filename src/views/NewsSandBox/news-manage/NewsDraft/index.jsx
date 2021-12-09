import { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res) => {
      const list = res.data
      setDataSource(list)
    })
  }, [username])

  function showConfirm(item) {
    confirm({
      title: 'Do you Want to delete this item?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        return
      }
    })
  }

  function deleteMethod(item) {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b style={{ color: 'darkslateblue' }}>{id}</b>
      }
    },
    {
      title: 'News Title',
      dataIndex: 'title'
    },
    {
      title: 'Author',
      dataIndex: 'author'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
            &nbsp;
            <Button shape="circle" icon={<EditOutlined />} />
            &nbsp;
            <Button type="primary" shape="circle" icon={<UploadOutlined />} />
          </>
        )
      }
    }
  ]

  return (
    <>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </>
  )
}
