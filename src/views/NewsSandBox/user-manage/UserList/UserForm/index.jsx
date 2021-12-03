import { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  const { roleList, regionList, isUpdateDisabled, isUpdate } = props
  const [isDisabled, setDisabled] = useState(false)

  //更新使用者資訊時若為Administrator禁用Region欄
  useEffect(() => {
    setDisabled(isUpdateDisabled)
  }, [isUpdateDisabled])

  const { roleId, region } = JSON.parse(localStorage.getItem('token'))
  const roleDescription = {
    1: 'admin',
    2: 'editor',
    3: 'subeditor'
  }

  function checkRegionDisable(item) {
    if (isUpdate) {
      if (roleDescription[roleId] === 'admin') return false
      else return true
    } else {
      if (roleDescription[roleId] === 'admin') return false
      else return item.value !== region
    }
  }

  function checkRoleDisable(item) {
    if (isUpdate) {
      if (roleDescription[roleId] === 'admin') return false
      else return true
    } else {
      if (roleDescription[roleId] === 'admin') return false
      else return roleDescription[item.id] !== 'subeditor'
    }
  }

  return (
    <div>
      <Form ref={ref} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input the data of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input the data of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="Region"
          rules={isDisabled ? [] : [{ required: true, message: 'Please input the data of collection!' }]}
        >
          <Select disabled={isDisabled}>
            {
              regionList.map((item) => (
              <Option
                value={item.value}
                key={item.id}
                disabled={checkRegionDisable(item)}
              >
                {item.title}
              </Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="Role"
          rules={[{ required: true, message: 'Please input the data of collection!' }]}
        >
          <Select onChange={(value) => {
            if(value === 1) {
              setDisabled(true)
              ref.current.setFieldsValue({
                region:''
              })
            }
            else setDisabled(false)
          }}>
            {roleList.map((item) => (
              <Option
                value={item.id}
                key={item.id}
                disabled={checkRoleDisable(item)}
              >
                {item.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
})

export default UserForm
