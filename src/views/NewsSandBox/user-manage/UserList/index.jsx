import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import UserForm from './UserForm'

const { confirm } = Modal

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddUserVisible, setAddUserVisible] = useState(false)
  const [isUpdateVisible, setUpdateVisible] = useState(false)
  const [isUpdateDisabled, setUpdateDisabled] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegion] = useState([])
  const [current, setCurrent] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const roleDescription = {
      1: 'admin',
      2: 'editor',
      3: 'subeditor'
    }

    axios.get('http://localhost:8000/users?_expand=role').then((res) => {
      const list = res.data
      setDataSource(
        roleDescription[roleId] === 'admin'
          ? list
          : [...list.filter((item) => item.username === username), ...list.filter((item) => item.region === region && roleDescription[item.roleId] === 'subeditor')]
      )
    })
  }, [username, roleId, region])

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

  function handleChange(item) {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

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

  function handleUpdate(item) {
    //非同步更新數據才能成功創建Modal
    setTimeout(() => {
      setUpdateVisible(true)
      if (item.roleId === 1) setUpdateDisabled(true)
      else setUpdateDisabled(false)
      updateForm.current.setFieldsValue(item)
    }, 0)

    setCurrent(item)
  }

  function deleteMethod(item) {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`)
  }

  const columns = [
    {
      title: 'Region',
      dataIndex: 'region',
      filters: [
        {
          text: 'Global',
          value: 'Global'
        },
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value
        }))
      ],

      onFilter: (value, item) => (value === 'Global' ? item.region === '' : item.region === value),

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
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} disabled={item.default} />
            &nbsp;
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
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
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0]
              }
            ])
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function updateFormOK() {
    updateForm.current.validateFields().then((value) => {
      setUpdateVisible(false)
      setDataSource(
        dataSource.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter((data) => data.id === value.roleId)[0]
            }
          }
          return item
        })
      )
      setUpdateDisabled(!isUpdateDisabled) // 避免重新選擇Role為Administrator後未確認更新, 造成下次開啟更新使用者時Role欄被禁用

      axios.patch(`http://localhost:8000/users/${current.id}`, value)
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

      <Modal
        visible={isUpdateVisible}
        title="Update Information"
        okText="Confirm"
        cancelText="Cancel"
        onCancel={() => {
          setUpdateVisible(false)
          setUpdateDisabled(!isUpdateDisabled) // 避免重新選擇Role為Administrator後未確認更新, 造成下次開啟更新使用者時Role欄被禁用
        }}
        onOk={() => updateFormOK()}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true} />
      </Modal>
    </>
  )
}
