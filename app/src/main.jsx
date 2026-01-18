import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { route } from './path'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Toaster 
            position="top-left"
            gutter={4}            
            containerClassName="flex flex-col-reverse" 
            toastOptions={{
                duration: 2000,
                style: {
                    // minWidth: "200px",
                    borderRadius: '4px',
                    border: '1px solid #00000024',
                    padding: "4px 8px",
                },
            }}
        />
        <RouterProvider router={route} />
    </StrictMode>,
)
