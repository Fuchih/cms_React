import { useState, useEffect, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons'
import * as Echarts from 'echarts'
import axios from 'axios'
import _ from 'lodash'

const { Meta } = Card

export default function Home(props) {
  const {
    username,
    region,
    role: { roleName }
  } = JSON.parse(localStorage.getItem('token'))

  const [popularList, setPopularList] = useState([])
  const [likeList, setLikeList] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then((res) => {
      setPopularList(res.data)
    })
    axios.get(`/news?publishState=2&_expand=category&_sort=like&_order=desc&_limit=6`).then((res) => {
      setLikeList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title))
      setDataSource(res.data)
    })

    return () => (window.onresize = null) // 記得銷毀組件

    function renderBarView(dataObj) {
      var myChart = Echarts.init(barRef.current)

      var option = {
        title: {
          text: 'News Category'
        },
        tooltip: {},
        legend: {
          data: ['Amount']
        },
        xAxis: {
          data: Object.keys(dataObj),
          axisLabel: { rotate: '-45', interval: 0 }
        },
        yAxis: {
          minInterval: 1
        },
        series: [
          {
            name: 'Amount',
            type: 'bar',
            data: Object.values(dataObj).map((item) => item.length)
          }
        ]
      }

      myChart.setOption(option)

      window.onresize = () => myChart.resize()
    }
  }, [])

  function renderPieView() {
    var currentData = dataSource.filter((item) => item.author === username)
    var groupObj = _.groupBy(currentData, (item) => item.category.title)

    var list = []
    for (var item in groupObj) {
      list.push({
        name: item,
        value: groupObj[item].length
      })
    }

    var myChart
    // If there is a chart instance already initialized on the dom.
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }

    var option
    option = {
      title: {
        text: 'Current User',
        x: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Amount',
          type: 'pie',
          radius: '80%',
          center: ['60%', '60%'],
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(128, 128, 128, 0.5)'
            }
          }
        }
      ]
    }

    option && myChart.setOption(option)
  }

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
              actions={[
                <PieChartOutlined
                  key="setting"
                  onClick={() => {
                    setTimeout(() => {
                      setVisible(true)
                      renderPieView()
                    }, 0)
                  }}
                />,
                <EditOutlined key="edit" onClick={() => props.history.push('/news-manage/add')} />,
                <EllipsisOutlined key="ellipsis" onClick={() => props.history.push('/user-manage/list')} />
              ]}
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

        <Drawer title="News Category" placement="right" onClose={() => setVisible(false)} visible={visible} width="60%">
          <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
        </Drawer>

        <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
      </div>
    </>
  )
}
