import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Button, Modal, Input, Form } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import './index.scss'

const EditableContext = React.createContext(null)
const { confirm } = Modal

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('/categories').then((res) => {
      setDataSource(res.data)
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
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }

  function handleSave(record) {
    setDataSource(
      dataSource.map((item) => {
        if (item.id === record.id) {
          return {
            id: item.id,
            title: record.title,
            value: record.title
          }
        }
        return item
      })
    )

    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title
    })
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
      title: 'Title',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: 'Title',
        handleSave
      })
    },

    {
      title: 'Action',
      render: (item) => {
        return (
          <>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
          </>
        )
      }
    }
  ]

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`
            }
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
      />
    </>
  )
}
