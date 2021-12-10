import { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalVisible, setModalVisible] = useState(false)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b style={{ color: 'darkslateblue' }}>{id}</b>
      }
    },
    {
      title: 'Role',
      dataIndex: 'roleName'
    },
    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
            &nbsp;
            <Button
              type="primary"
              shape="circle"
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setModalVisible(true)
                setCurrentRights(item.rights)
                setCurrentId(item.id)
              }}
            />
          </>
        )
      }
    }
  ]

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
    axios.delete(`/roles/${item.id}`)
  }

  useEffect(() => {
    axios.get(`/roles`).then((res) => {
      setDataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/rights?_embed=children`).then((res) => {
      setRightList(res.data)
    })
  }, [])

  return (
    <>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="Permission Assignment" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree checkable checkedKeys={currentRights} onCheck={onCheck} checkStrictly={true} treeData={rightList} />
      </Modal>
    </>
  )

  function handleOk() {
    setModalVisible(false)
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId)
          return {
            ...item,
            rights: currentRights
          }
        return item
      })
    )

    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  }

  function handleCancel() {
    setModalVisible(false)
  }

  function onCheck(checkKeys) {
    setCurrentRights(checkKeys.checked)
  }
}
