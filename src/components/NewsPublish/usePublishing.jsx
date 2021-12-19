import axios from 'axios'
import { useState, useEffect } from 'react'
import { notification } from 'antd'

export default function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios(`/news?author=${username}&publishState=${type}&_expand=category`).then((res) => {
      setDataSource(res.data)
    })
  }, [username, type])

  function handlePublish(id) {
    setDataSource(dataSource.filter((item) => item.id !== id))
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now()
      })
      .then(() => {
        notification.info({
          message: `Notification`,
          description: `Publishing / Published`,
          placement: 'bottomRight'
        })
      })
  }

  function handleOffline(id) {
    setDataSource(dataSource.filter((item) => item.id !== id))
    axios
      .patch(`/news/${id}`, {
        publishState: 3
      })
      .then(() => {
        notification.info({
          message: `Notification`,
          description: `Publishing / Offline`,
          placement: 'bottomRight'
        })
      })
  }

  function handleDelete(id) {
    setDataSource(dataSource.filter((item) => item.id !== id))
    axios.delete(`/news/${id}`).then(() => {
      notification.info({
        message: `Notification`,
        description: `Delete Successfully`,
        placement: 'bottomRight'
      })
    })
  }

  return { dataSource, handlePublish, handleOffline, handleDelete }
}
