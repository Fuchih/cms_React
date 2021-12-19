import NewsPublish from '../../../../components/NewsPublish'
import usePublish from '../../../../components/NewsPublish/usePublishing'
import { Button } from 'antd'

export default function Published() {
  const { dataSource, handleOffline } = usePublish(2)

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button danger onClick={() => handleOffline(id)}>
            Offline
          </Button>
        )}
      ></NewsPublish>
    </>
  )
}
