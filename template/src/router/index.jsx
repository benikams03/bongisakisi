import { createHashRouter } from 'react-router-dom'

import SelectProfil from '../window/selectProfil'
import LayoutCaissier from '../components/common/layout/layout-caissier'

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
                path: '',
                element: <div>Caissier</div>
            }
        ]
    }
])
