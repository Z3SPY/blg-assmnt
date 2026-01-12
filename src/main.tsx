import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Redux imports
import { Provider } from 'react-redux';
import { store } from './state/store';

/** Put Redux Provider here */

createRoot(document.getElementById('root')!).render(

  
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>,  
  </Provider>


)
