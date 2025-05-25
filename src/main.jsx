import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css'
import App from './App.jsx'

import AttackDetails from './AttackDetails.jsx'

import { CookiesProvider } from 'react-cookie';

import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById('root')).render(
<CookiesProvider>
  <PrimeReactProvider>
  {/* <StrictMode>
    <App />
  </StrictMode> */}
  <BrowserRouter>
      <Routes> 
          <Route path="/static" element={<App />} />   
      </Routes>
    </BrowserRouter>

  </PrimeReactProvider>
  </CookiesProvider>
  
)
