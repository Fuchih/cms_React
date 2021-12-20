import { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd'
import axios from 'axios'
import moment from 'moment'
import { LikeTwoTone } from '@ant-design/icons'
import './index.scss'

export default function Detail(props) {
  const [newsInfo, setNewsInfo] = useState(null)

  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo({
          ...res.data,
          view: res.data.view + 1
        })
        return res.data
      })
      .then((res) => {
        axios.patch(`/news/${props.match.params.id}`, {
          view: res.view + 1
        })
      })
  }, [props.match.params.id])

  function handleLike() {
    setNewsInfo({
      ...newsInfo,
      like: newsInfo.like + 1
    })

    axios.patch(`/news/${props.match.params.id}`, {
      like: newsInfo.like + 1
    })
  }

  return (
    <div>
      {newsInfo && (
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={
              <>
                {newsInfo.category.title} <LikeTwoTone onClick={() => handleLike()} />
              </>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Created">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="Publication Time">{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="view">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="Like">{newsInfo.like}</Descriptions.Item>
              <Descriptions.Item label="Comment">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ margin: '0 24px', minHeight: '300px', border: '1px solid #ccc' }}></div>
        </div>
      )}
    </div>
  )
}
