import { createBrowserRouter } from 'react-router-dom'

import Login from './screens/auth/login'

import Caissier from './screens/caissier/page'

export const route = createBrowserRouter([
    {
        path : '/',
        element: <Caissier />
    },


    {
        path: '/auth',
        element: <Login /> 
    }
])