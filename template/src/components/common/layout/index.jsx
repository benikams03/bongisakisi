import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, User, Bell,  } from 'lucide-react';
import { aquisitionService } from '../../../services/admin/aquivistion_service';
import { ActivateKeyService } from './../../../services/activate-key';
import ActivateKey from './../activate_key';
import Head from './nav-head';


export default function LayoutIndex({ menu, menuSecond, curentLink }) {
    

    const activeSection = useLocation().pathname

    // ======================================================================
    const [acquisitionCount, setAcquisitionCount] = useState(0)

    const [openKey, setOpenKey] = useState(false)
    const [isExpired, setExpired] = useState(false)

    useEffect(()=>{
        (async () => {
            const count = await aquisitionService.getCount()
            setAcquisitionCount(count)

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

    return (
    <div className='h-screen flex flex-col'>
        <Head />

        <div className='flex h-[95.5%]'>
            <div className='w-[20%] bg-emerald-900 flex flex-col justify-between text-white sticky right-0 h-full border-r border-gray-200 px-3 py-1.5'>
                <div>
                    <nav className='flex flex-col gap-1'>
                        {menu?.map(item => {
                            const Icon = item.icon
                            return (
                            <Link
                                to={curentLink + item.id}
                                key={item.id}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm
                                    ${activeSection === curentLink + item.id 
                                        ? 'bg-emerald-600/50 text-emerald-300' 
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
                            </Link>)
                        })}
                    </nav>

                    <div className={`flex flex-col gap-1 ${ menuSecond ? 'border-t border-gray-50/10' : '' } pt-2 mt-2`}>
                        {menuSecond?.map(item => {
                            const Icon = item.icon
                            return (
                            <Link
                                to={curentLink + item.id}
                                key={item.id}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm
                                    ${activeSection === curentLink + item.id 
                                        ? 'bg-emerald-600/50 text-emerald-300'
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
                            </Link>)
                        })}
                    </div>
                </div>


                <div className='mb-2'>
                    <Link to="/"
                        className='
                            flex items-center text-sm gap-2 border border-emerald-700 justify-center py-1.5 rounded-lg bg-emerald-800
                            hover:bg-emerald-800/90 
                            active:bg-emerald-800/50 active:scale-97  
                        '>
                        Se déconnnectr
                        <LogOut className='w-4' />
                    </Link>
                </div>
            </div>

            <div className='w-[82%] h-full bg-gray-50 overflow-hidden'>
                <div className='w-full h-full p-3 bg-white rounded-lg border border-gray-200 overflow-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>

        {/* Modal pour activer la licence ou utiliser le mode essaie */}
        <ActivateKey 
            open={openKey}
            setOpen={(value) => setOpenKey(value)}
            isExpired={isExpired}
        />
    </div>)
}
