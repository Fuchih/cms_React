import React from 'react'
import axios from 'axios'

export default function Home() {
  function get() {
    axios.get('http://localhost:8000/posts').then((res) => console.log(res.data))
  }

  return (
    <>
      Home
      <button onClick={get}>Click</button>
    </>
  )
}
