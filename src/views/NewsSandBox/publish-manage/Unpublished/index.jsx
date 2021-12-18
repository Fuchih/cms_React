import NewsPublish from '../../../../components/publish-manage/NewsPublish'
import usePublish from '../../../../components/publish-manage/NewsPublish/usePublishing'
import { Button } from 'antd'

export default function Unpublished() {
  const { dataSource, handlePublish } = usePublish(1)

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" onClick={() => handlePublish(id)}>
            Publish
          </Button>
        )}
      ></NewsPublish>
    </>
  )
}
