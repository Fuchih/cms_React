import { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      const list = res.data
      list.forEach((item) =>
        // 判斷子層級是否有數據
        item.children?.length === 0 ? (item.children = '') : item.children
      )
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
      axios.delete(`/rights/${item.id}`)
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId) // 過濾子層級數據
      list[0].children = list[0].children.filter((data) => data.id !== item.id)
      setDataSource([...dataSource]) //set新陣列讓React識別, 因第一級未發生變化(by reference)
      axios.delete(`/children/${item.id}`)
    }
  }

  function switchMethod(item) {
    item.pagePermission = item.pagePermission === 1 ? 0 : 1
    setDataSource([...dataSource])

    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagePermission: item.pagePermission
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagePermission: item.pagePermission
      })
    }
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
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
            &nbsp;
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch checked={item.pagePermission} onChange={() => switchMethod(item)}></Switch>
                </div>
              }
              title="Setting"
              trigger={item.pagePermission === undefined ? '' : 'click'}
            >
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagePermission === undefined} />
            </Popover>
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
