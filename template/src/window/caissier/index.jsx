import { useState, useEffect } from 'react'
import { Package, Search, CreditCard, Pill, Plus, ShoppingCart, Minus, Trash2, CheckCircle,Printer  } from 'lucide-react'
import { Bouton } from './../../components/ui/bouton/index'
import { Input } from './../../components/ui/input/index'
import Modal from "@mui/material/Modal"
import { produitService } from '../../services/admin/produit_service'
import { calculateStockStatus } from '../../hooks/calcul'
import { ordersService } from '../../services/caissier/orders_service'
import { number } from '../../hooks/number'
import { formatDateToDMYWithTime } from '../../hooks/format_date'
import { imprimantService } from '../../services/caissier/imprimant_service'


export default function IndexCaisse() {

    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [produits, setProduits] = useState([])
    const [panier, setPanier] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const [caches, setCaches] = useState(false)
    const [sendData, setSendData] = useState([])

    useEffect(() => {
        (async ()=> {
            const data_medoc = await produitService.get()
            setProduits(data_medoc.data)
            const data_panier = await ordersService.get()
            setPanier(data_panier.data)
            setTotal(data_panier.data.reduce((sum, item) => sum + item.price_total, 0));
        })()
    }, [loading])

    const handleAdd = async (id) => {
        const data = await ordersService.add({
            medicament_id: id
        })
        if (data) {
            setLoading(!loading)
        }
    }
    
    const handleRemove = async (id) => {
        const data = await ordersService.remove({
            medicament_id: id
        })
        if (data) {
            setLoading(!loading)
        }
    }
    
    const handleRemoveDirect = async (id) => {
        const data = await ordersService.removeDirect({
            medicament_id: id
        })
        if (data) {
            setLoading(!loading)
        }
    }


    return(<>
    <div className="flex-1 h-full flex gap-3">
        {/* Produits */}
        <div className="flex-1 h-full overflow-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Catalogue des médicaments</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{produits?.length} produits</span>
                    </div>
                </div>

                <div className="space-y-4 flex items-center gap-2 mb-3">
                    <div className='w-full'>
                        <Input icons={<Search className="text-gray-400 w-5 h-5" />} 
                            placeholder="Rechercher un médicament, n° lot, ou catégorie..." 
                            className='w-full'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                    </div>
                </div>
                

                <div className="grid grid-cols-3 gap-4">
                    {produits?.map((items, index) => {
                        const view = items.medicament_name.toLowerCase().includes(searchTerm.toLowerCase())
                        return(
                        <div key={index} className={`${ view ? '' : 'hidden' } group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50`}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-200 rounded-lg flex items-center justify-center">
                                    <Pill className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${calculateStockStatus(items.stock, items.last_stock).color}
                                        ${calculateStockStatus(items.stock, items.last_stock).bgColor}`}>
                                        Stock: {items.stock}
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-600">{number.format(items.price_sell)} FC</span>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">{items.medicament_name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{items.family_name}</p>
                            <Bouton outline
                                onClick={() => handleAdd(items.id)}
                                className='w-full group-hover:scale-105'>
                                <Plus className="w-4 h-4" />
                                Ajouter 
                            </Bouton>
                        </div> )
                    })}
                </div>
            </div>
        </div>


        <div className="w-[32%] h-full sticky top-3 rounded-lg border border-gray-200 flex flex-col justify-between">
            <div className="p-4 flex items-center justify-between ">
                <h2 className="text-xl font-bold text-gray-900">Panier</h2>
                <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">{panier?.length} articles</span>
                </div>
            </div>
            <div className="p-2 h-full overflow-auto space-y-3">
               
                { panier?.length === 0 && (<div className="flex flex-col items-center justify-center h-full w-full px-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Le panier est vide</p>
                    <p className="text-sm text-gray-400 mt-1 mb-16">Ajoutez des médicaments pour commencer</p>
                </div>)}

                { panier?.map((items, index)=>(
                    <div key={index} className="flex justify-between border border-gray-200 rounded-lg items-center py-2 px-4 hover:bg-gray-50 transition-all duration-200">
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{items.name}</h4>
                            <div className="flex items-center text-xs gap-3 text-sm text-gray-600 mt-1">
                                <span>{number.format(items.price_total)} FC</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button onClick={() => handleRemove(items.id_medoc)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-medium">{items.quantity}</span>
                                <button onClick={() => handleAdd(items.id_medoc)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button onClick={() => handleRemoveDirect(items.id_medoc)}
                                className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors">
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    </div>
                )) }
                
            </div>

            <div className="border-t border-gray-200 space-y-1 p-4 bg-white rounded-b-xl">
                <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-gray-500">Total</span>
                    <span className="text-2xl font-bold">{number.format(total)} FC</span>
                </div>
                <Bouton primary
                    className='w-full'
                    onClick={() => {
                        if (panier?.length > 0) {
                            setOpen(true)
                        }
                    }}>
                    <CreditCard className="w-5 h-5" />
                    Valider la vente
                </Bouton>
            </div>
        </div>
    </div>

    {/* ================================================================================= */}
    <Modal 
        open={open}
        // onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
            <div className="flex justify-center flex-col items-center">
                <CheckCircle className="bg-emerald-600 rounded-full p-2 text-gray-300" size={44} />
                <h3 className="font-bold text-lg">Vente effectuée</h3>
            </div>
            <div className="p-4">
                <div className="flex justify-center items-center">
                    <div className="text-sm">
                        {/* <p>Facture #{panier[0]?.panier}</p> */}
                        <p>{formatDateToDMYWithTime(panier[0]?.datecreate)}</p>
                    </div>
                </div>
                <div className="py-2">
                    {panier?.map((items, index)=>(
                        <div key={index} className="flex justify-between items-center">
                            <p className="text-gray-600">{items.name} <span className='text-sm text-gray-400'>X {items.quantity}</span></p>
                            <p className="font-semibold ">{number.format(items.price_total)} Fc</p>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-gray-400/50 my-2" />
                <div className="flex justify-between items-center text-xl font-bold">
                    <h2 className="">Total</h2>
                    <p className="font-semibold text-green-600">{number.format(total) } Fc</p>
                </div>
            </div>
            
            { caches === false && <div className="flex gap-2">
                <Bouton className="w-full" outline
                    onClick={() => setOpen(false)}>
                    Annuler
                </Bouton>
                <Bouton primary
                    onClick={async () => {
                        await setSendData(panier)
                        const data = await ordersService.confirmPanier()
                        if (data) {
                            setCaches(true)
                            // setOpen(false)
                        }
                    }} 
                    className="w-full">
                    Confirmation
                </Bouton>
            </div> }

            { caches === true && 
            <div className='flex flex-col gap-2'>
                <Bouton className="w-full"
                    onClick={async ()=>{
                        const res = await imprimantService.print(sendData)
                        if(res) {
                            setOpen(false)
                            setCaches(false)
                            setSendData([])
                            setLoading(!loading)
                        }
                    }}>
                    <Printer className='w-4 h-4 text-gray-200' />
                    Imprimer</Bouton>

                <Bouton className="w-full" outline
                    onClick={() => {
                        setOpen(false)
                        setCaches(false)
                        setLoading(!loading)
                    }}>
                    Annuler
                </Bouton>
            </div> }
        </div>
    </Modal>
    </>)
}