import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then((res) => {
      const list = res.data
      list.forEach((item) => {
        // 判斷子層級是否有數據
        if (item.children.length === 0) item.children = ''
      })
      setDataSource(list)
    })
  }, [])

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
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      axios.delete(`http://localhost:8000/rights/${item.id}`)
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId) // 過濾子層級數據
      list[0].children = list[0].children.filter((data) => data.id !== item.id)
      setDataSource([...dataSource]) //set新陣列讓React識別, 因第一級未發生變化(by reference)
      axios.delete(`http://localhost:8000/children/${item.id}`)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b style={{ color: 'darkred' }}>{id}</b>
      }
    },
    {
      title: 'Authority',
      dataIndex: 'title'
    },
    {
      title: 'Pathway',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            <Button
              danger shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showConfirm(item)}
            />
            &nbsp;
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
          </>
        )
      }
    }
  ]

  return (
    <>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </>
  )
}
