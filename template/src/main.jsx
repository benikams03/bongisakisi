import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { route } from './router/index'
import { Toaster } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

// Configuration personnalisée du toaster
const toasterConfig = {
  position: 'top-center',
  duration: 4000,
  style: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '10px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxWidth: '400px',
  },
  success: {
    duration: 3000,
    icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    style: {
      borderLeft: '4px solid #10b981',
    }
  },
  error: {
    duration: 5000,
    icon: <XCircle className="w-4 h-4 text-red-500" />,
    style: {
      borderLeft: '4px solid #ef4444',
    }
  },
  loading: {
    duration: Infinity,
    icon: <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />,
    style: {
      borderLeft: '4px solid #10b981',
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
    <RouterProvider router={route} />
  </StrictMode>,
)
