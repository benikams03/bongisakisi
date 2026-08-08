import { useState, useEffect, useContext } from 'react'
import { User, Search, CreditCard, Plus, ShoppingCart, Minus, Trash2, CheckCircle, Printer, ArrowRight, Eye } from 'lucide-react'
import { Bouton } from './../../components/ui/bouton/index'
import { Input } from './../../components/ui/input/index'
import Modal from "@mui/material/Modal"
import { ordersService } from '../../services/caissier/orders_service'
import { clientService } from '../../services/caissier/client_service'
import { number } from '../../hooks/number'
import { formatDateToDMYWithTime } from '../../hooks/format_date'
import { imprimantService } from '../../services/caissier/imprimant_service'
import { parametreService } from '../../services/admin/parametre_service'
import { ThemeContext } from '../../router/provider'
import DettesLoading from '../../components/common/loading/caissier/dettes'

export default function Dettes() {
    const { color } = useContext(ThemeContext)

    const [open, setOpen] = useState(false)
    const [openInvoice, setOpenInvoice] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedCommand, setSelectedCommand] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [panier, setPanier] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const [caches, setCaches] = useState(false)
    const [sendData, setSendData] = useState([])

    const [printers, setPrinters] = useState([])
    const [customers, setCustomers] = useState([])
    const [loadingCustomers, setLoadingCustomers] = useState(true)
    const [hasCart, setHasCart] = useState(false)

    useEffect(() => {
        (async ()=> {
            const data_printers = await parametreService.getPdfSettings()
            setPrinters(data_printers)
            
            const data_customers = await clientService.getClients()
            setCustomers(data_customers.map(c => ({
                ...c,
                totalDebt: c.total_debt,
                commands: []
            })))
            setLoadingCustomers(false)
        })()
    }, [])

    const handleAddCommandToCart = (command) => {
        if (hasCart) return // Prevent adding if cart already has items
        
        const allItems = command.medicaments.map(med => ({
            id: med.id,
            id_medoc: med.id,
            name: med.name,
            quantity: med.quantity,
            price_total: med.total,
            originalPrice: med.price,
            panier_id: command.id // Store the panier ID for validation
        }))
        
        setPanier(allItems)
        setHasCart(true)
    }

    const handleCancelCart = () => {
        setPanier([])
        setTotal(0)
        setHasCart(false)
    }

    const handleValidatePayment = async () => {
        const panierId = panier[0]?.panier_id
        if (!panierId) return
        
        const success = await clientService.validateDebtPayment(panierId)
        if (success) {
            await setSendData(panier)
            setCaches(true)
            
            // Close modal if no printer configured
            !printers.selectedPrinter && setOpen(false)
        }
    }

    const handleAfterPayment = async () => {
        // Reload all clients to refresh debt totals
        const data_customers = await clientService.getClients()
        setCustomers(data_customers.map(c => ({
            ...c,
            totalDebt: c.total_debt,
            commands: []
        })))
        
        // Reload commands for selected customer if still has debt
        if (selectedCustomer) {
            const updatedCustomer = data_customers.find(c => c.id === selectedCustomer.id)
            if (updatedCustomer && updatedCustomer.total_debt > 0) {
                const commands = await clientService.getClientCommands(selectedCustomer.id)
                setSelectedCustomer({ ...updatedCustomer, totalDebt: updatedCustomer.total_debt, commands: commands })
            } else {
                setSelectedCustomer(null)
            }
        }
        
        // Clear cart
        setPanier([])
        setTotal(0)
        setHasCart(false)
    }

    const handleViewInvoice = (command) => {
        setSelectedCommand(command)
        setOpenInvoice(true)
    }

    const handleSelectCustomer = async (customer) => {
        setSelectedCustomer(customer)
        if (customer.commands.length === 0) {
            const commands = await clientService.getClientCommands(customer.id)
            setCustomers(prev => prev.map(c => 
                c.id === customer.id 
                    ? { ...c, commands: commands }
                    : c
            ))
            setSelectedCustomer({ ...customer, commands: commands })
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

    const handleAddToCart = (item) => {
        const existingItem = panier.find(i => i.id === item.id)
        if (existingItem) {
            setPanier(panier.map(i => 
                i.id === item.id 
                    ? { ...i, quantity: i.quantity + 1, price_total: i.price_total + item.price }
                    : i
            ))
        } else {
            setPanier([...panier, {
                id: item.id,
                id_medoc: item.id,
                name: item.name,
                quantity: 1,
                price_total: item.price,
                originalPrice: item.price
            }])
        }
    }

    useEffect(() => {
        setTotal(panier.reduce((sum, item) => sum + item.price_total, 0))
    }, [panier])

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return(<>
        {loadingCustomers ? (
            <DettesLoading />
        ) : (
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
                        {filteredCustomers.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Aucun client avec dettes</p>
                            </div>
                        ) : (
                            filteredCustomers.map((customer) => (
                            <div 
                                    key={customer.id}
                                    onClick={() => handleSelectCustomer(customer)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        selectedCustomer?.id === customer.id ? 'bg-gray-50 border-l-4 border-l-gray-800' : ''
                                    }`}
                                >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                                        <p className="text-sm text-green-600 font-medium">{number.format(customer.totalDebt || 0)} FC</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                                ))
                            )}
                        </div>
                </div>

                {/* Middle - Customer commands */}
                <div className="flex-1 h-full overflow-auto">
                    {selectedCustomer ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                                <p className="text-sm text-gray-600 mt-1">Historique des commandes</p>
                            </div>

                            <div className="flex-1 overflow-auto space-y-3">
                                {selectedCustomer.commands.map((command, index) => (
                                    <div 
                                        key={index} 
                                        className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                                            hasCart ? 'opacity-60 grayscale pointer-events-none' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs text-gray-500">{command.date}</span>
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                        {command.medicaments.length} article(s)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-orange-600">{number.format(command.total || 0)} FC</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Bouton 
                                                outline
                                                onClick={() => handleViewInvoice(command)}
                                                className="flex-1 text-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Voir facture
                                            </Bouton>
                                            <Bouton 
                                                primary
                                                onClick={() => handleAddCommandToCart(command)}
                                                className="flex-1 text-sm"
                                                disabled={hasCart}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Ajouter au panier
                                            </Bouton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex items-center justify-center">
                            <div className="text-center">
                                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Sélectionnez un client</p>
                                <p className="text-sm text-gray-400 mt-1">Choisissez un client pour voir ses commandes</p>
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
                                        <span>{number.format(items.price_total || 0)} FC</span>
                                        <span className="text-gray-400">X {items.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        )) }
                    </div>

                    <div className="border-t border-gray-200 space-y-2 p-4 bg-white rounded-b-xl">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-lg font-bold text-gray-500">Total à payer</span>
                            <span className="text-2xl font-bold">{number.format(total || 0)} FC</span>
                        </div>
                        <div className='flex gap-2'>
                            <Bouton outline
                                className='w-full'
                                onClick={handleCancelCart}>
                                <CreditCard className="w-5 h-5" />
                                Annuler
                            </Bouton>
                            <Bouton primary
                                className='w-full'
                                onClick={() => {
                                    if (panier?.length > 0) {
                                        setOpen(true)
                                    }
                                }}>
                                <CreditCard className="w-5 h-5" />
                                Valider
                            </Bouton>
                        </div>
                    </div>
                </div>
            </div>
        )}

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
                                <p className="font-semibold ">{number.format(items.price_total || 0)} Fc</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-gray-400/50 my-2" />
                    <div className="flex justify-between items-center text-xl font-bold">
                        <h2 className="">Total payé</h2>
                        <p className="font-semibold text-green-600">{number.format(total || 0) } Fc</p>
                    </div>
                </div>
                
                { caches === false && <div className="flex gap-2">
                    <Bouton className="w-full" outline
                        onClick={() => {
                            setOpen(false)
                            setCaches(false)
                        }}>
                        Annuler
                    </Bouton>
                    <Bouton primary
                        onClick={async () => {
                            await handleValidatePayment()
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
                                await handleAfterPayment()
                                setOpen(false)
                                setCaches(false)
                                setSendData([])
                            }
                        }}>
                        <Printer className='w-4 h-4 text-gray-200' />
                        Imprimer</Bouton>

                    <Bouton className="w-full" outline
                        onClick={async () => {
                            await handleAfterPayment()
                            setOpen(false)
                            setCaches(false)
                        }}>
                        Annuler
                    </Bouton>
                </div> }
            </div>
        </Modal>

        {/* Invoice Modal */}
        <Modal 
            open={openInvoice}
            onClose={() => {
                setOpenInvoice(false)
                setSelectedCommand(null)
            }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
            >
            <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
                <div className="p-4">
                    <div className="flex justify-center items-center">
                        <div className="text-sm">
                            <p>{formatDateToDMYWithTime(selectedCommand?.date)}</p>
                            <p className="text-orange-600 font-medium mt-1">Client: {selectedCustomer?.name}</p>
                        </div>
                    </div>
                    <div className="py-2">
                        { selectedCommand?.medicaments?.map((items, index) => {
                            return (
                                <div key={index} className="flex justify-between items-center">
                                    <p className="text-gray-600">{items.name} <span className="text-xs text-gray-500">X {items.quantity}</span></p>
                                    <p className="font-semibold ">{number.format(items.total || 0)} Fc</p>
                                </div>
                            )
                        })}
                    </div>
                    
                    <div className="border-t border-gray-400/50 my-2" />
                    <div className="flex justify-between items-center text-xl font-bold">
                        <h2 className="">Total</h2>
                        <p className="font-semibold text-green-600">{number.format(selectedCommand?.total || 0)} Fc</p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <Bouton className="w-full" outline
                        onClick={() => {
                            setOpenInvoice(false)
                            setSelectedCommand(null)
                        }}>
                        Fermer
                    </Bouton>
                </div> 
            </div>
        </Modal>
    </>)
}
