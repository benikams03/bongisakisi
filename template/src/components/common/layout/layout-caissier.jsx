import { Outlet, useLocation, Link } from 'react-router-dom';
import { ShoppingCart, Package, History, FileText, LogOut, User } from 'lucide-react';
import { Bouton } from './../../ui/bouton/index';

const menuItems = [
    { id: '/', label: 'Caisse', icon: ShoppingCart },
    { id: 'acquisition', label: 'Acquisition', icon: Package },
    { id: 'historique', label: 'Historique', icon: History },
    { id: 'rapports', label: 'Rapports', icon: FileText },
]

export default function LayoutCaissier() {

    const activeSection = useLocation().pathname

    return (<div className='h-screen flex'>
        <div className='w-[19%] bg-emerald-800 flex flex-col justify-between text-white sticky right-0 h-full border-r border-gray-200 p-3'>
            <div>
                <h2 className="text-xl font-semibold mb-4 p-2 border-b border-gray-50/20 mx-2">Menu Caissier</h2>
                <nav className='flex flex-col gap-1'>
                    {menuItems.map(item => {
                        const Icon = item.icon
                        return (
                        <Link
                            to={`/caissier/${item.id}`}
                            key={item.id}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                                ${activeSection === '/caissier' + item.id 
                                    ? 'bg-emerald-600/50 text-emerald-300' 
                                    : 'hover:bg-gray-50/10 text-gray-300'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>)
                    })}
                </nav>
            </div>
            <div className='border-t border-gray-50/30 pt-4'>
                <Link to="/">
                    <Bouton outline
                        className="w-full">
                        <LogOut className="w-4 h-4" />
                        Changer de compte
                    </Bouton>
                </Link>
            </div>
        </div>

        <div className='w-[81%] h-full bg-gray-100'>
            <nav className='bg-white flex justify-end p-4 border-b border-gray-200 z-10'>
                <div className='flex gap-2'>
                    <User className="w-6 h-6 bg-gray-300 p-1 rounded-lg" />
                    <p className='font-semibold text-gray-600'>Caissier</p>

                </div>    
            </nav>
            <div className='h-[90%] w-full p-3 overflow-auto'> 
                <div className='w-full p-3 bg-white rounded-lg border border-gray-200'>
                    <Outlet />
                </div>
            </div>
        </div>
    </div>)
}