import { createHashRouter } from 'react-router-dom'

import SelectProfil from '../window/selectProfil'
import LayoutCaissier from '../components/common/layout/layout-caissier'
import LayoutAdmin from '../components/common/layout/layout-admin'

// CAISSIER
import IndexCaisse from '../window/caissier/index'
import Historique from '../window/caissier/historique'
import Rapport from '../window/caissier/rapport'
import Acquisition from '../window/caissier/acquisition'

// ADMIN
import Dashboard from '../window/admin/dashboard'
import Produits from '../window/admin/produits'
import Categories from '../window/admin/categories'
import Rapports from '../window/admin/rapports'
import Settings from '../window/admin/settings/index'
import Approvisionnement from '../window/admin/approvisionnement'
import ExportView from '../window/admin/export-view'

export const route = createHashRouter([
    {
        path: '/',
        element: <SelectProfil />
    },
    {
        path: '/caissier',
        element: <LayoutCaissier />,
        children: [
            {
                path: 'home',
                element: <IndexCaisse />
            },
            {
                path: 'historique',
                element: <Historique />
            },
            {
                path: 'rapports',
                element: <Rapport />
            },
            {
                path: 'acquisition',
                element: <Acquisition />
            }
        ]
    },
    {
        path: '/admin',
        element: <LayoutAdmin />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'produits',
                element: <Produits />
            },
            {
                path: 'categories',
                element: <Categories />
            },
            {
                path: 'approvisionnement',
                element: <Approvisionnement />
            },
            {
                path: 'rapports',
                element: <Rapports />
            },
            {
                path: 'export-view/:type/:date',
                element: <ExportView />
            },
            {
                path: 'settings',
                element: <Settings />
            }
        ]
    }
])
