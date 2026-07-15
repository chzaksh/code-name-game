import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import StandaloneMap from './components/StandaloneMap.jsx'

// בודק בשורת הכתובת אם אנחנו במצב חלון מפה נפרד
const isMapOnly = new URLSearchParams(window.location.search).get('map') === 'true';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ניתוב לוגי: טוען רק את מה שצריך לפי ה-URL */}
    {isMapOnly ? <StandaloneMap /> : <App />}
  </StrictMode>,
)