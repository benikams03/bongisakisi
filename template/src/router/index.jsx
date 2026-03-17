import { createHashRouter } from 'react-router-dom'

import SelectProfil from '../window/selectProfil'
import LayoutCaissier from '../components/common/layout/layout-caissier'

// CAISSIER
import IndexCaisse from '../window/caissier/index'
import Historique from '../window/caissier/historique'

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
            }
        ]
    }
])
