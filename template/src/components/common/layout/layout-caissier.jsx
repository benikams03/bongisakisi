import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, History, FileText, LogOut, User, Bell } from 'lucide-react';
import FeatureNotAvailableModal from '../modal/FeatureNotAvailableModal';
import { ActivateKeyService } from './../../../services/activate-key';
import ActivateKey from './../activate_key';

const menuItems = [
    { id: 'home', label: 'Caisse', icon: ShoppingCart },
    { id: 'acquisition', label: 'Acquisition', icon: Package },
    { id: 'historique', label: 'Historique', icon: History },
    { id: 'rapports', label: 'Rapports', icon: FileText },
]

export default function LayoutCaissier() {

    const [showFeatureModal, setShowFeatureModal] = useState(false)
    const [openKey, setOpenKey] = useState(false)
    const [isExpired, setExpired] = useState(false)

    const activeSection = useLocation().pathname

    useEffect(()=>{
        (async () => {
            const activateKey = await ActivateKeyService.get()
            if(!activateKey.data){
                setOpenKey(true)
            }
            // check license
            const isExpired = await ActivateKeyService.check()
            if(isExpired){
                setExpired(true)
                setOpenKey(true)
            }
        })()
    }, [])

    return (<div className='h-screen flex'>
        <div className='w-[19%] bg-emerald-800 flex flex-col justify-between text-white sticky right-0 h-full border-r border-gray-200 p-3'>
            <div>
                <nav className='flex flex-col gap-1'>
                    {menuItems.map(item => {
                        const Icon = item.icon
                        return (
                        <Link
                            to={`/caissier/${item.id}`}
                            key={item.id}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm
                                ${activeSection === '/caissier/' + item.id 
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

            <div>
                <div className='border-t border-gray-50/20 pt-3 pb-2'>
                    <div className='flex justify-between items-center px-2'>
                        <div className='flex gap-2 items-center'>
                            <User className="w-8 h-8 bg-white p-1.5 rounded-lg text-slate-600" />
                            <p className='text-sm text-gray-300'>Caissier</p>
                        </div>
                        <Link to="/">
                            <LogOut className='w-7 h-7 text-white cursor-pointer hover:bg-emerald-700 hover:border hover:border-emerald-600 p-1 rounded' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <div className='w-[81%] h-full bg-gray-100 overflow-hidden'>
            <nav className='bg-white flex justify-end px-4 py-2 border-b border-gray-200 z-10'>
                <div className='flex items-center gap-3'>
                    <button 
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border border-gray-200"
                        onClick={() => setShowFeatureModal(true)}
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>     
            </nav>
            <div className='h-[92.5%] w-full p-3'> 
                <div className='w-full h-full p-3 bg-white rounded-lg border border-gray-200'>
                    <Outlet />
                </div>
            </div>
        </div>

        {/* Modal pour fonctionnalités non disponibles */}
        <FeatureNotAvailableModal 
            isOpen={showFeatureModal}
            onClose={() => setShowFeatureModal(false)}
            featureName="les notifications"
        />

        {/* Modal pour activer la licence ou utiliser le mode essaie */}
        <ActivateKey 
            open={openKey}
            setOpen={(value) => setOpenKey(value)}
            isExpired={isExpired}
        />
    </div>)
}