import { forwardRef, useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  const { roleList, regionList } = props
  const [isDisabled, setDisabled] = useState(false)

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
            {regionList.map((item) => (
              <Option value={item.value} key={item.id}>
                {item.title}
              </Option>
            ))}
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
              <Option value={item.id} key={item.id}>
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
