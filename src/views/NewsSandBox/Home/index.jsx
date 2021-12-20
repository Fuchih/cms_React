import { useState, useEffect } from 'react'
import { Card, Col, Row, List, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Meta } = Card

export default function Home() {
  const {
    username,
    region,
    role: { roleName }
  } = JSON.parse(localStorage.getItem('token'))

  const [popularList, setPopularList] = useState([])
  const [likeList, setLikeList] = useState([])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then((res) => {
      setPopularList(res.data)
    })
    axios.get(`/news?publishState=2&_expand=category&_sort=like&_order=desc&_limit=6`).then((res) => {
      setLikeList(res.data)
    })
  }, [])

  return (
    <>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Most Popular" bordered={true}>
              <List
                size="small"
                dataSource={popularList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Most Like" bordered={true}>
              <List
                size="small"
                dataSource={likeList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
              actions={[<PieChartOutlined key="setting" />, <EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region ? region : 'Global'}</b>
                    <p>{roleName}</p>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
