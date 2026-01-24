import { createBrowserRouter } from 'react-router-dom'

import Login from './screens/auth/login'

import Caissier from './screens/caissier/page'

import Layout_admin from './screens/admin/layout'
import Dashbord from './screens/admin/dashbord'
import Stock from './screens/admin/stock'
import Medicaments from './screens/admin/medicaments'
import Categorie from './screens/admin/categorie'
import Rapports from './screens/admin/rapport'

export const route = createBrowserRouter([
    {
        path : '/',
        element: <Caissier />
    },
    // ============================================================================
    {
        path: '/admin',
        element: <Layout_admin />,
        children: [
            {
                path: '',
                element: <Dashbord />
            },
            {
                path: 'stock',
                element: <Stock />
            },
            {
                path: 'medicament',
                element: <Medicaments />
            },
            {
                path: 'categorie',
                element: <Categorie />
            },
            {
                path: 'rapport',
                element: <Rapports />
            },
        ]
    },
    // ============================================================================
    {
        path: '/auth',
        element: <Login /> 
    }
])