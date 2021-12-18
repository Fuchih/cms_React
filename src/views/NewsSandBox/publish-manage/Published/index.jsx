import NewsPublish from '../../../../components/publish-manage/NewsPublish'
import usePublish from '../../../../components/publish-manage/NewsPublish/usePublishing'
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
