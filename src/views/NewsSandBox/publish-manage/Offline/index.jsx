import NewsPublish from '../../../../components/NewsPublish'
import usePublish from '../../../../components/NewsPublish/usePublishing'
import { Button } from 'antd'

export default function Offline() {
  const { dataSource, handleDelete } = usePublish(3)

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        )}
      ></NewsPublish>
    </>
  )
}
