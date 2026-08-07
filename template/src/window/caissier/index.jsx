import { useState, useEffect, useContext } from 'react'
import { Package, Search, CreditCard, Pill, Plus, ShoppingCart, Minus, Trash2, CheckCircle,Printer, User  } from 'lucide-react'
import { Bouton } from './../../components/ui/bouton/index'
import { Input } from './../../components/ui/input/index'
import Modal from "@mui/material/Modal"
import { produitService } from '../../services/admin/produit_service'
import { calculateStockStatus } from '../../hooks/calcul'
import { ordersService } from '../../services/caissier/orders_service'
import { number } from '../../hooks/number'
import { formatDateToDMYWithTime } from '../../hooks/format_date'
import { imprimantService } from '../../services/caissier/imprimant_service'
import { parametreService } from '../../services/admin/parametre_service'
import { ThemeContext } from '../../router/provider'
import IndexLoading from '../../components/common/loading/caissier/index'


export default function IndexCaisse() {

    const { color } = useContext(ThemeContext)

    const [open, setOpen] = useState(false)
    const [openDebt, setOpenDebt] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [produits, setProduits] = useState([])
    const [panier, setPanier] = useState([])
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const [caches, setCaches] = useState(false)
    const [sendData, setSendData] = useState([])

    const [printers, setPrinters] = useState([])

    // Debt related states
    const [debtCustomerName, setDebtCustomerName] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    
    // Mock data for existing debts
    const [existingDebts] = useState([
        { id: 1, name: 'Jean Mutombo', debt: 50000 },
        { id: 2, name: 'Marie Nseka', debt: 25000 },
        { id: 3, name: 'Pierre Mbala', debt: 75000 },
        { id: 4, name: 'Anne Kanza', debt: 15000 },
    ])

    useEffect(() => {
        (async ()=> {
            const data_medoc = await produitService.get()
            setProduits(data_medoc.data)
            const data_panier = await ordersService.get()
            setPanier(data_panier.data)
            setTotal(data_panier.data.reduce((sum, item) => sum + item.price_total, 0));
            const data_printers = await parametreService.getPdfSettings()
            setPrinters(data_printers)
            setInitialLoading(false)
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

            {initialLoading ? (
                <IndexLoading />
            ) : (
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
                        <div key={index} className={`${ view ? '' : 'hidden' } group border border-gray-200 rounded-xl p-4 hover:shadow-lg ${color?.border.hover[300]} transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50`}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center">
                                    <Pill className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${calculateStockStatus(items.stock, items.last_stock, color?.text[700], color?.bg[100]).color}
                                        ${calculateStockStatus(items.stock, items.last_stock, color?.text[700], color?.bg[100]).bgColor}`}>
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
            )}
        </div>


        <div className="w-[32%] h-full sticky top-3 rounded-lg border border-gray-200 flex flex-col justify-between">
            <div className="p-4 flex items-center justify-between ">
                <h2 className="text-xl font-bold text-gray-900">Panier</h2>
                <div className={"flex items-center gap-2 px-3 py-1 rounded-lg " + color?.bg[100]}>
                    <ShoppingCart className={"w-4 h-4 " + color?.text[700]} />
                    <span className={"text-xs font-medium " + color?.text[700]}>{panier?.length} articles</span>
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

            <div className="border-t border-gray-200 space-y-2 p-4 bg-white rounded-b-xl">
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
                <Bouton outline
                    className='w-full'
                    onClick={() => {
                        if (panier?.length > 0) {
                            setOpenDebt(true)
                        }
                    }}>
                    <User className="w-5 h-5" />
                    Valider comme dette
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
                <CheckCircle className={"rounded-full my-4 " + color?.text[700]} size={35} />
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
                            !printers.selectedPrinter && setOpen(false)
                            !printers.selectedPrinter && setLoading(!loading)
                        }
                    }} 
                    className="w-full">
                    Confirmation
                </Bouton>
            </div> }

            { caches === true && printers.selectedPrinter && 
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

    {/* ================================================================================= */}
    {/* Debt Modal */}
    <Modal 
        open={openDebt}
        onClose={() => {
            setOpenDebt(false)
            setDebtCustomerName('')
            setShowSuggestions(false)
        }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div className="bg-white border border-gray-300 w-1/3 p-6 rounded-lg shadow animate-fadeIn">
            <div className="flex justify-center flex-col items-center mb-4">
                <User className={"rounded-full my-2 " + color?.text[700]} size={35} />
                <h3 className="font-bold text-lg">Validation de dette</h3>
            </div>
            
            <div className="p-4">
                <div className="flex justify-center items-center mb-4">
                    <div className="text-sm">
                        <p>{formatDateToDMYWithTime(new Date())}</p>
                    </div>
                </div>
                
                <div className="py-2 mb-4">
                    {panier?.map((items, index)=>(
                        <div key={index} className="flex justify-between items-center">
                            <p className="text-gray-600">{items.name} <span className='text-sm text-gray-400'>X {items.quantity}</span></p>
                            <p className="font-semibold ">{number.format(items.price_total)} Fc</p>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-gray-400/50 my-2" />
                <div className="flex justify-between items-center text-xl font-bold mb-4">
                    <h2 className="">Total dette</h2>
                    <p className="font-semibold text-orange-600">{number.format(total) } Fc</p>
                </div>

                {/* Customer name input with autocomplete */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du client
                    </label>
                    <div className="relative">
                        <Input 
                            placeholder="Entrez le nom du client..."
                            value={debtCustomerName}
                            onChange={(e) => {
                                setDebtCustomerName(e.target.value)
                                setShowSuggestions(e.target.value.length > 0)
                            }}
                            icons={<User className="text-gray-400 w-4 h-4" />}
                        />
                        
                        {/* Autocomplete suggestions */}
                        {showSuggestions && debtCustomerName.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                                {existingDebts
                                    .filter(debt => 
                                        debt.name.toLowerCase().includes(debtCustomerName.toLowerCase())
                                    )
                                    .map((debt) => (
                                        <div 
                                            key={debt.id}
                                            onClick={() => {
                                                setDebtCustomerName(debt.name)
                                                setShowSuggestions(false)
                                            }}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-900">{debt.name}</span>
                                                <span className="text-sm text-orange-600">
                                                    Dette: {number.format(debt.debt)} FC
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                                {existingDebts.filter(debt => 
                                    debt.name.toLowerCase().includes(debtCustomerName.toLowerCase())
                                ).length === 0 && (
                                    <div className="px-4 py-3 text-gray-500 text-sm">
                                        Aucun client trouvé
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2">
                <Bouton className="w-full" outline
                    onClick={() => {
                        setOpenDebt(false)
                        setDebtCustomerName('')
                        setShowSuggestions(false)
                    }}>
                    Annuler
                </Bouton>
                <Bouton primary
                    onClick={async () => {
                        if (debtCustomerName.trim()) {
                            // Here you would add the debt validation logic
                            console.log('Debt validated for:', debtCustomerName, 'Amount:', total)
                            setOpenDebt(false)
                            setDebtCustomerName('')
                            setShowSuggestions(false)
                            setLoading(!loading)
                        }
                    }} 
                    className="w-full">
                    Confirmer la dette
                </Bouton>
            </div>
        </div>
    </Modal>
    </>)
}