import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function showFatalError(message: string) {
  const root = document.getElementById('root')
  if (root && !root.hasChildNodes()) {
    root.innerHTML = `<pre style="color:#ff6b6b;background:#1a1a2e;padding:16px;white-space:pre-wrap;font-size:12px;font-family:monospace;margin:0;min-height:100vh;box-sizing:border-box;">${message}</pre>`
  }
}
window.addEventListener('error', (e) => showFatalError(`${e.message}\n${e.error?.stack ?? ''}`))
window.addEventListener('unhandledrejection', (e) => showFatalError(String(e.reason?.stack ?? e.reason)))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
