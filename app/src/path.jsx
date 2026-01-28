import { createHashRouter } from 'react-router-dom'

import Login from './screens/auth/login'
import Caissier from './screens/caissier/page'
import Layout_admin from './screens/admin/layout'
import Dashbord from './screens/admin/dashbord'
import Stock from './screens/admin/stock'
import Medicaments from './screens/admin/medicaments'
import Categorie from './screens/admin/categorie'
import Rapports from './screens/admin/rapport'
import Middleware from './utils/hooks/Middleware'

export const route = createHashRouter([
    {
        path : '/',
        element: <Middleware roles={['caissier']}> <Caissier /> </Middleware>
    },
    // ============================================================================ 
    {
        path: '/admin',
        element: <Middleware roles={['admin']}> <Layout_admin /> </Middleware>,
        children: [
            { path: '', element: <Dashbord /> },
            { path: 'stock', element: <Stock /> },
            { path: 'medicament', element: <Medicaments /> },
            { path: 'categorie', element: <Categorie /> },
            { path: 'rapport', element: <Rapports /> },
        ]
    },
    // ============================================================================ 
    {
        path: '/auth',
        element: <Login /> 
    }
])
