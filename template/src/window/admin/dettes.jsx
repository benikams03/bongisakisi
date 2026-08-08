import { useState, useEffect } from 'react'
import { User, Search, ArrowRight, Package } from 'lucide-react'
import { Input } from './../../components/ui/input/index'
import { number } from '../../hooks/number'
import { clientService } from '../../services/caissier/client_service'
import AdminDettesLoading from '../../components/common/loading/admin/dettes'

export default function AdminDettes() {
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedCommand, setSelectedCommand] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [customers, setCustomers] = useState([])
    const [loadingCustomers, setLoadingCustomers] = useState(true)

    useEffect(() => {
        (async () => {
            const data_customers = await clientService.getClients()
            setCustomers(data_customers.map(c => ({
                ...c,
                totalDebt: c.total_debt,
                phone: '',
                commands: []
            })))
            setLoadingCustomers(false)
        })()
    }, [])

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

    return(<>
        {loadingCustomers ? (
            <AdminDettesLoading />
        ) : (
            <div className="flex-1 h-full flex gap-3">
                {/* First column - Customer list */}
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
                                    onClick={() => {
                                        handleSelectCustomer(customer)
                                        setSelectedCommand(null)
                                    }}
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
                                            <p className="text-sm text-green-600 font-medium mt-1">{number.format(customer.totalDebt || 0)} FC</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Second column - Commands list */}
                <div className="w-[35%] h-full overflow-auto">
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
                                        onClick={() => setSelectedCommand(command)}
                                        className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                                            selectedCommand?.id === command.id ? 'bg-gray-50 border-l-4 border-l-gray-800' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs text-gray-500">{command.date}</span>
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                        {command.medicaments.length} article(s)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-orange-600">{number.format(command.total)} FC</p>
                                            </div>
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

                {/* Third column - Medications details */}
                <div className="flex-1 h-full overflow-auto">
                    {selectedCommand ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Détail de la commande</h2>
                                <p className="text-sm text-gray-600 mt-1">{selectedCommand.date}</p>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">Total commande</span>
                                    <span className="text-2xl font-bold text-green-600">{number.format(selectedCommand.total || 0)} FC</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Médicaments</h3>
                                <div className="space-y-3">
                                    {selectedCommand.medicaments?.map((med, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{med.name}</h4>
                                                        <p className="text-xs text-gray-500 mt-1">Qté: {med.quantity} × {number.format(med.price || 0)} FC</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{number.format(med.total || 0)} FC</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex items-center justify-center">
                            <div className="text-center">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Sélectionnez une commande</p>
                                <p className="text-sm text-gray-400 mt-1">Choisissez une commande pour voir les médicaments</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </>)
}
