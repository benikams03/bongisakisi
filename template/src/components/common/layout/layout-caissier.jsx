import { ShoppingCart, Package, History, FileText } from 'lucide-react';
import LayoutIndex from '.';

const menuItems = [
    { id: 'home', label: 'Caisse', icon: ShoppingCart },
    { id: 'acquisition', label: 'Acquisition', icon: Package },
    { id: 'historique', label: 'Historique', icon: History },
    { id: 'rapports', label: 'Rapports', icon: FileText },
]

export default function LayoutCaissier() {

    return (<>
        <LayoutIndex curentLink='/caissier/'
            menu={menuItems}
            />
    </>)
}