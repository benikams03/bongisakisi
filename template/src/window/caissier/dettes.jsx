import { useState, useEffect, useContext } from 'react'
import { User, Search, CreditCard, Plus, ShoppingCart, Minus, Trash2, CheckCircle, Printer, ArrowRight } from 'lucide-react'
import { Bouton } from './../../components/ui/bouton/index'
import { Input } from './../../components/ui/input/index'
import Modal from "@mui/material/Modal"
import { ordersService } from '../../services/caissier/orders_service'
import { number } from '../../hooks/number'
import { formatDateToDMYWithTime } from '../../hooks/format_date'
import { imprimantService } from '../../services/caissier/imprimant_service'
import { parametreService } from '../../services/admin/parametre_service'
import { ThemeContext } from '../../router/provider'

export default function Dettes() {
    const { color } = useContext(ThemeContext)

    const [open, setOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [panier, setPanier] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const [caches, setCaches] = useState(false)
    const [sendData, setSendData] = useState([])

    const [printers, setPrinters] = useState([])

    // Mock data for customers with debts
    const [customers] = useState([
        { 
            id: 1, 
            name: 'Jean Mutombo', 
            totalDebt: 50000,
            debts: [
                { id: 1, name: 'Paracetamol 500mg', quantity: 2, price: 5000, total: 10000, date: '2024-01-15' },
                { id: 2, name: 'Amoxicilline 1g', quantity: 1, price: 15000, total: 15000, date: '2024-01-20' },
                { id: 3, name: 'Ibuprofène 400mg', quantity: 5, price: 5000, total: 25000, date: '2024-02-01' },
            ]
        },
        { 
            id: 2, 
            name: 'Marie Nseka', 
            totalDebt: 25000,
            debts: [
                { id: 1, name: 'Vitamine C', quantity: 3, price: 5000, total: 15000, date: '2024-02-10' },
                { id: 2, name: 'Fer 200mg', quantity: 2, price: 5000, total: 10000, date: '2024-02-15' },
            ]
        },
        { 
            id: 3, 
            name: 'Pierre Mbala', 
            totalDebt: 75000,
            debts: [
                { id: 1, name: 'Antibiotique large spectre', quantity: 1, price: 35000, total: 35000, date: '2024-01-25' },
                { id: 2, name: 'Antipyrétique', quantity: 4, price: 10000, total: 40000, date: '2024-02-05' },
            ]
        },
        { 
            id: 4, 
            name: 'Anne Kanza', 
            totalDebt: 15000,
            debts: [
                { id: 1, name: 'Sirop toux', quantity: 2, price: 7500, total: 15000, date: '2024-02-12' },
            ]
        },
    ])

    useEffect(() => {
        (async ()=> {
            const data_printers = await parametreService.getPdfSettings()
            setPrinters(data_printers)
        })()
    }, [])

    const handleAddToCart = (debtItem) => {
        const existingItem = panier.find(item => item.id === debtItem.id)
        if (existingItem) {
            setPanier(panier.map(item => 
                item.id === debtItem.id 
                    ? { ...item, quantity: item.quantity + 1, price_total: item.price_total + debtItem.price }
                    : item
            ))
        } else {
            setPanier([...panier, {
                id: debtItem.id,
                id_medoc: debtItem.id,
                name: debtItem.name,
                quantity: 1,
                price_total: debtItem.price,
                originalPrice: debtItem.price
            }])
        }
    }

    const handleRemoveFromCart = (id) => {
        const existingItem = panier.find(item => item.id === id)
        if (existingItem && existingItem.quantity > 1) {
            setPanier(panier.map(item => 
                item.id === id 
                    ? { ...item, quantity: item.quantity - 1, price_total: item.price_total - item.originalPrice }
                    : item
            ))
        } else {
            setPanier(panier.filter(item => item.id !== id))
        }
    }

    const handleRemoveDirect = (id) => {
        setPanier(panier.filter(item => item.id !== id))
    }

    const handleAddAllToCart = () => {
        if (selectedCustomer) {
            const allItems = selectedCustomer.debts.map(debt => ({
                id: debt.id,
                id_medoc: debt.id,
                name: debt.name,
                quantity: debt.quantity,
                price_total: debt.total,
                originalPrice: debt.price
            }))
            setPanier(allItems)
        }
    }

    useEffect(() => {
        setTotal(panier.reduce((sum, item) => sum + item.price_total, 0))
    }, [panier])

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return(<>
    <div className="flex-1 h-full flex gap-3">
        {/* Left side - Customer list */}
        <div className="w-[30%] h-full flex flex-col">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Clients avec dettes</h2>
                <div className="space-y-2">
                    <Input 
                        icons={<Search className="text-gray-400 w-4 h-4" />} 
                        placeholder="Rechercher un client..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-auto">
                {filteredCustomers.map((customer) => (
                    <div 
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedCustomer?.id === customer.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                                <p className="text-sm text-orange-600 font-medium">{number.format(customer.totalDebt)} FC</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Middle - Customer debts */}
        <div className="flex-1 h-full overflow-auto">
            {selectedCustomer ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                            <p className="text-sm text-gray-600 mt-1">Détail des dettes</p>
                        </div>
                        <Bouton 
                            outline
                            onClick={handleAddAllToCart}
                            className="text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Tout ajouter au panier
                        </Bouton>
                    </div>

                    <div className="flex-1 overflow-auto space-y-3">
                        {selectedCustomer.debts.map((debt, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{debt.name}</h4>
                                        <p className="text-xs text-gray-500">Date: {debt.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-orange-600">{number.format(debt.total)} FC</p>
                                        <p className="text-xs text-gray-500">Qté: {debt.quantity}</p>
                                    </div>
                                </div>
                                <Bouton 
                                    outline
                                    onClick={() => handleAddToCart(debt)}
                                    className="w-full text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Ajouter au panier
                                </Bouton>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Sélectionnez un client</p>
                        <p className="text-sm text-gray-400 mt-1">Choisissez un client pour voir ses dettes</p>
                    </div>
                </div>
            )}
        </div>

        {/* Right side - Cart */}
        <div className="w-[32%] h-full sticky top-3 rounded-lg border border-gray-200 flex flex-col justify-between">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Panier de paiement</h2>
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
                    <p className="text-sm text-gray-400 mt-1 mb-16">Ajoutez des dettes à payer</p>
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
                                <button onClick={() => handleRemoveFromCart(items.id)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-medium">{items.quantity}</span>
                                <button onClick={() => handleAddToCart({ id: items.id, name: items.name, price: items.originalPrice })}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button onClick={() => handleRemoveDirect(items.id)}
                                className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors">
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    </div>
                )) }
            </div>

            <div className="border-t border-gray-200 space-y-2 p-4 bg-white rounded-b-xl">
                <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-gray-500">Total à payer</span>
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
                    Valider le paiement
                </Bouton>
            </div>
        </div>
    </div>

    {/* ================================================================================= */}
    <Modal 
        open={open}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
            <div className="flex justify-center flex-col items-center">
                <CheckCircle className={"rounded-full my-4 " + color?.text[700]} size={35} />
                <h3 className="font-bold text-lg">Paiement effectué</h3>
            </div>
            <div className="p-4">
                <div className="flex justify-center items-center">
                    <div className="text-sm">
                        <p>Client: {selectedCustomer?.name}</p>
                        <p>{formatDateToDMYWithTime(new Date())}</p>
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
                    <h2 className="">Total payé</h2>
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
                        // Here you would add the payment confirmation logic
                        console.log('Payment confirmed for:', selectedCustomer?.name, 'Amount:', total)
                        setCaches(true)
                        !printers.selectedPrinter && setOpen(false)
                        !printers.selectedPrinter && setLoading(!loading)
                        setPanier([])
                        setTotal(0)
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
    </>)
}
