import MyRouter from './Router'
import { Provider } from 'react-redux'
import store from './redux/store'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <MyRouter></MyRouter>
    </Provider>
  )
}

export default App
