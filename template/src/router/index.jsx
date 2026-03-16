import { createHashRouter } from 'react-router-dom'

import SelectProfil from '../window/selectProfil'

export const route = createHashRouter([
  {
    path: '/',
    element: <SelectProfil />
  }
])
