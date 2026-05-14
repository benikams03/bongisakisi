import { useState, useContext } from "react"
import { Minus, X, Bell, User } from "lucide-react"
import FeatureNotAvailableModal from '../modal/FeatureNotAvailableModal';
import logo from "./../../../assets/logo.png"
import { ThemeContext } from '../../../router/provider';

export default function Head(){
    const [showFeatureModal, setShowFeatureModal] = useState(false)
    const { color } = useContext(ThemeContext)

    const handleCloseWindow = () => {
        if (window.localApi) {
            window.localApi.invoke('close-window')
        }
    }

    const handleMinimizeWindow = () => {
        if (window.localApi) {
            window.localApi.invoke('minimize-window')
        }
    }

    return(<>
    <h1 className={`h-[4.5%] ${color?.bg[900]} flex justify-between items-center border-b border-gray-50/20`}>
        <div className="px-3">
            <div className="flex items-center">
                <img src={logo} className="w-5" />
                <h1 className="pl-2 text-sm font-bold text-gray-200 md:block hidden tracking-[-1px] uppercase font-['Inter',sans-serif]">Bongisa
                    <span className="font-light text-white/50">Kisi</span>
                </h1>
            </div>
        </div>
        
        <div className='text-gray-100 flex items-center'>
            <div className="pr-2 flex gap-1">
                <button className={`p-1 cursor-pointer px-1.5 ${color?.bg[800]} border ${color?.border[700]} ${color?.border.active[800]} ${color?.bg.active[900]} rounded-sm`}>
                    <User className="w-4 h-4 text-gray-100" />
                </button>
                <button 
                    className={`relative p-1 cursor-pointer px-1.5 ${color?.bg.hover[700]} ${color?.bg.active[800]} rounded-sm`}
                    onClick={() => setShowFeatureModal(true)}>
                    <Bell className="w-4 h-4 text-gray-100" />
                    <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                </button>
            </div>

            <button 
                onClick={handleMinimizeWindow}
                className={`py-2 px-4 ${color?.bg.hover[700]} transition-colors duration-200 ${color?.bg.active[800]}`}>
                <Minus size={18}/>
            </button>
            <button 
                onClick={handleCloseWindow}
                className='py-2 px-4 hover:bg-red-500 transition-colors duration-200 active:bg-red-600'>
                <X size={18}/>
            </button>
        </div>
    </h1>

    {/* Modal pour fonctionnalités non disponibles */}
    <FeatureNotAvailableModal 
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        featureName="les notifications"
    />
    </>)
}