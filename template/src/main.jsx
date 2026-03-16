import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { route } from './router/index'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>,
)
