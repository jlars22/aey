import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#46AD8D',
      contrastText: '#fff' //button text white instead of black
    }
  }
})

root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
)

reportWebVitals()
