import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import UserForm from './UserForm'

const { confirm } = Modal

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddUserVisible, setAddUserVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegion] = useState([])
  const addForm = useRef(null)

  useEffect(() => {
    axios.get('http://localhost:8000/users?_expand=role').then((res) => {
      const list = res.data
      setDataSource(list)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:8000/regions').then((res) => {
      const list = res.data
      setRegion(list)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:8000/roles').then((res) => {
      const list = res.data
      setRoleList(list)
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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`)
  }

  const columns = [
    {
      title: 'Region',
      dataIndex: 'region',
      render: (region) => {
        return <b style={{ color: 'darkslateblue' }}>{region === '' ? 'Global' : region}</b>
      }
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: 'Username',
      dataIndex: 'username'
    },
    {
      title: 'Status',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} disabled={item.default} />
            &nbsp;
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} />
          </>
        )
      }
    }
  ]

  function addFormOK() {
    addForm.current
      .validateFields()
      .then((value) => {
        setAddUserVisible(false)
        addForm.current.resetFields()
        axios
          .post(`http://localhost:8000/users`, {
            ...value,
            roleState: true,
            default: false
          })
          .then((res) => {
            setDataSource([...dataSource, {
              ...res.data,
              role:roleList.filter(item => item.id === value.roleId)[0]
            }])
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <Button type="primary" onClick={() => setAddUserVisible(true)}>
        Add Users
      </Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />

      <Modal
        visible={isAddUserVisible}
        title="Add a new User"
        okText="Add"
        cancelText="Cancel"
        onCancel={() => {
          setAddUserVisible(false)
        }}
        onOk={() => addFormOK()}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={addForm} />
      </Modal>
    </>
  )
}
