import MyRouter from './Router'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MyRouter></MyRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
