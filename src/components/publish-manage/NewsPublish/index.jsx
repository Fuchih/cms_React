import { Table, Tag } from 'antd'

export default function NewsPublish(props) {
  const columns = [
    {
      title: 'News Title',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: 'Author',
      dataIndex: 'author'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category) => {
        return <Tag color="orange">{category.title}</Tag>
      }
    },
    {
      title: 'Action',
      render: (item) => {
        return <>{props.button(item.id)}</>
      }
    }
  ]

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </div>
  )
}
