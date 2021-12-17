import { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import style from './index.module.scss'
import axios from 'axios'
import NewsEditor from '../../../../components/NewsEditor'

const { Step } = Steps
const { Option } = Select

export default function NewsAdd(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [categories, setCategories] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const NewsForm = useRef(null)

  useEffect(() => {
    axios.get('/categories').then((res) => setCategories(res.data))
  }, [])

  const User = JSON.parse(localStorage.getItem('token'))

  function handleNext() {
    if (currentStep === 0)
      NewsForm.current.validateFields().then((res) => {
        setCurrentStep(currentStep + 1)
        setFormInfo(res)
      })
    else {
      if (content === '' || content.trim() === '<p></p>') return message.error('Content can NOT be blank!')
      else return setCurrentStep(currentStep + 1)
    }
  }

  function handlePrevious() {
    setCurrentStep(currentStep - 1)
  }

  function handleSave(auditState) {
    axios
      .post('/news', {
        ...formInfo,
        content: content,
        region: User.region ? User.region : 'Global',
        author: User.username,
        roleId: User.roleId,
        auditState: auditState,
        publishState: 0,
        createTime: Date.now(),
        like: 0,
        view: 0,
        publishTime: 0
      })
      .then((res) => {
        props.history.push(auditState === 0 ? '/news-manage/draft' : '/review-manage/list')

        notification.info({
          message: `Notification`,
          description: `${auditState === 0 ? 'Save as Draft' : 'Waiting for censorship'}`,
          placement: 'bottomRight'
        })
      })
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }

  return (
    <div>
      <PageHeader className="site-page-header" title="Write News" subTitle="This is a subtitle" />
      <Steps current={currentStep}>
        <Step title="Basic Information" description=" Title, Category" />
        <Step title="Content" description="News content" />
        <Step title="Submitting" description="Draft, Review" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={currentStep === 0 ? '' : style.hidden}>
          <Form ref={NewsForm} {...layout} name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="off">
            <Form.Item label="News Title" name="title" rules={[{ required: true, message: 'Please input the news title!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="News Category" name="categoryId" rules={[{ required: true, message: 'Please select news category!' }]}>
              <Select>
                {categories.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={currentStep === 1 ? '' : style.hidden}>
          <NewsEditor
            getContent={(value) => {
              setContent(value)
            }}
          />
        </div>
        <div className={currentStep === 2 ? '' : style.hidden}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {currentStep === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              Draft
            </Button>
            <Button danger style={{ marginLeft: '10px' }} onClick={() => handleSave(1)}>
              Submit
            </Button>
          </span>
        )}
        {currentStep < 2 && (
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        )}
        {currentStep > 0 && (
          <Button onClick={handlePrevious} style={{ margin: '0 10px' }}>
            Previous
          </Button>
        )}
      </div>
    </div>
  )
}
