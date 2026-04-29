import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Tag, FileText, Settings, LogOut, User, Bell, Truck, ChevronDown, Download } from 'lucide-react';
import FeatureNotAvailableModal from '../modal/FeatureNotAvailableModal';
import { aquisitionService } from '../../../services/admin/aquivistion_service';
import { produitService } from '../../../services/admin/produit_service';
import { isExpiringSoon } from '../../../hooks/format_date';
import { ActivateKeyService } from './../../../services/activate-key';
import ActivateKey from './../activate_key';

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
    const [showFeatureModal, setShowFeatureModal] = useState(false)

    const activeSection = useLocation().pathname

    // ======================================================================
    const [acquisitionCount, setAcquisitionCount] = useState(0)
    const [produitsCount, setProduitsCount] = useState(0)

    const [openKey, setOpenKey] = useState(false)
    const [isExpired, setExpired] = useState(false)

    useEffect(()=>{
        (async () => {
            const count = await aquisitionService.getCount()
            setAcquisitionCount(count)
            const produitCount = await produitService.get()
            const expiredProducts = produitCount?.data?.filter(p => isExpiringSoon(p.date_expiration)).length || 0
            const stockLow = produitCount?.data?.filter(p => ((p.stock / p.last_stock) * 100) <= 45).length || 0
            setProduitsCount(expiredProducts + stockLow)

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
    },[activeSection])
    
    
    // ======================================================================

    return (<div className='h-screen flex'>
        <div className='w-[20%] bg-slate-900 flex flex-col justify-between text-white sticky right-0 h-full border-r border-gray-200 p-3'>
            <div>
                <nav className='flex flex-col gap-1'>
                    {menuItems.map(item => {
                        const Icon = item.icon
                        return (
                        <Link
                            to={`/admin/${item.id}`}
                            key={item.id}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm
                                ${activeSection === '/admin/' + item.id 
                                    ? 'bg-slate-700/50 text-slate-300' 
                                    : 'hover:bg-gray-50/10 text-gray-300'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>

                            {item.notif == 1 && (
                                <div className='bg-red-500 text-white px-2 py-1 rounded-full text-[10px]'>
                                    <span>{acquisitionCount > 9 ? '9+' : acquisitionCount}</span>
                                </div>
                            )}
                            {item.notif == 2 && (
                                <div className='bg-red-500 text-white px-2 py-1 rounded-full text-[10px]'>
                                    <span>{produitsCount > 9 ? '9+' : produitsCount}</span>
                                </div>
                            )}
                        </Link>)
                    })}
                </nav>

                <div className='flex flex-col gap-1 border-t border-gray-50/20 pt-3 mt-3'>
                    {menuItemsSecondaire.map(item => {
                        const Icon = item.icon
                        return (
                        <Link
                            to={`/admin/${item.id}`}
                            key={item.id}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm
                                ${activeSection === '/admin/' + item.id 
                                    ? 'bg-slate-700/50 text-slate-300' 
                                    : 'hover:bg-gray-50/10 text-gray-300'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>

                            {item.notif == 1 && (
                                <div className='bg-red-500 text-white px-2 py-1 rounded-full text-[10px]'>
                                    <span>{acquisitionCount > 9 ? '9+' : acquisitionCount}</span>
                                </div>
                            )}
                            {item.notif == 2 && (
                                <div className='bg-red-500 text-white px-2 py-1 rounded-full text-[10px]'>
                                    <span>{produitsCount > 9 ? '9+' : produitsCount}</span>
                                </div>
                            )}
                        </Link>)
                    })}
                </div>
            </div>


            <div className=''>
                <div className='border-t border-gray-50/20 pt-3 pb-2'>
                    <div className='flex justify-between items-center px-2'>
                        <div className='flex gap-2 items-center'>
                            <User className="w-8 h-8 bg-white p-1.5 rounded-lg text-slate-600" />
                            <p className='text-sm text-gray-300'>Administration</p>
                        </div>
                        <Link to="/">
                            <LogOut className='w-7 h-7 text-gray-400 cursor-pointer hover:bg-gray-700 hover:border hover:border-gray-600 p-1 rounded' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <div className='w-[82%] h-full bg-gray-50 overflow-hidden'>
            <nav className='bg-white flex justify-end items-center px-4 py-2 border-b border-gray-200 z-10'>
                
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
                <div className='w-full h-full p-3 bg-white rounded-lg border border-gray-200 overflow-hidden'>
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
