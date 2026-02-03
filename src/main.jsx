import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; //only plain bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //for bootstrap components like navbar toggler
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'; //redux.jpg provider: if a value changes re-renders components that are subscribed to that value
import { store } from './store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
