import { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd'
import axios from 'axios'
import moment from 'moment'

export default function NewsPreview(props) {
  const [newsInfo, setNewsInfo] = useState(null)

  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then((res) => setNewsInfo(res.data))
  }, [props.match.params.id])

  const auditList = ['Unreviewed', 'Reviewing', 'Approval', 'Disapproval']
  const publishList = ['Unpublished', 'Published', 'Online', 'Offline']

  return (
    <div>
      {newsInfo && (
        <div className="site-page-header-ghost-wrapper">
          <PageHeader onBack={() => window.history.back()} title={newsInfo.title} subTitle={newsInfo.category.title}>
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Created">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="Creation Time">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="Publication Time">{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="Censorship">
                <span style={{ color: 'red' }}>{auditList[newsInfo.auditState]}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Publication">
                <span style={{ color: 'red' }}>{publishList[newsInfo.publishState]}</span>
              </Descriptions.Item>
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
