import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { route } from './router/index'
import { Toaster } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { ThemeProvider } from './router/provider'

// Configuration personnalisée du toaster
const toasterConfig = {
    position: 'top-left',
    duration: 2500,
    style: {
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        borderRadius: '0.375rem',
        padding: '8px 10px',
        boxShadow: '0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '280px',
        fontSize: '12px',
    },
    success: {
        duration: 2000,
        icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
        style: {
            background: 'rgba(255, 255, 255, 0.9)',
        }
    },
    error: {
        duration: 3000,
        icon: <XCircle className="w-3.5 h-3.5 text-red-500" />,
        style: {
            background: 'rgba(255, 255, 255, 0.9)',
        }
    },
    loading: {
        duration: Infinity,
        icon: <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />,
        style: {
            background: 'rgba(255, 255, 255, 0.9)',
        }
    }
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Toaster 
        {...toasterConfig}
        toastOptions={{
            ...toasterConfig,
            // Personnalisation du bouton de fermeture
            closeButton: (
            <button className="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
            </button>
            ),
            // Style personnalisé pour tous les toasts
            style: {
            ...toasterConfig.style,
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            }
        }}
        />
        <ThemeProvider>
            <RouterProvider router={route} />
        </ThemeProvider>
    </StrictMode>,
)
