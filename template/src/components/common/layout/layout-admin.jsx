import { LayoutDashboard, Package, Tag, FileText, Settings, Truck, Download } from 'lucide-react';
import LayoutIndex from '.';

const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'produits', label: 'Produits', icon: Package },
    { id: 'categories', label: 'Catégories', icon: Tag },
    { id: 'approvisionnement', label: 'Commandes', icon: Truck, notif : 1 },
    { id: 'ravitaillement', label: 'Ravitaillement', icon: Package, notif : 2 },
    { id: 'rapports', label: 'Rapports', icon: FileText },
]

const menuItemsSecondaire = [
    { id: 'export', label: 'Export', icon: Download },
    { id: 'settings', label: 'Paramètres', icon: Settings },
]

export default function LayoutAdmin() {

    return (<>
        <LayoutIndex curentLink='/admin/'
            menu={menuItems}
            menuSecond={menuItemsSecondaire}
            />
    </>)
}
