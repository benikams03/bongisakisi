import { useState } from 'react'
import { User, Search, ArrowRight, Calendar, Package } from 'lucide-react'
import { Input } from './../../components/ui/input/index'
import { number } from '../../hooks/number'

export default function AdminDettes() {
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Mock data for customers with debts
    const [customers] = useState([
        { 
            id: 1, 
            name: 'Jean Mutombo', 
            totalDebt: 50000,
            phone: '+243 123 456 789',
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
            phone: '+243 234 567 890',
            debts: [
                { id: 1, name: 'Vitamine C', quantity: 3, price: 5000, total: 15000, date: '2024-02-10' },
                { id: 2, name: 'Fer 200mg', quantity: 2, price: 5000, total: 10000, date: '2024-02-15' },
            ]
        },
        { 
            id: 3, 
            name: 'Pierre Mbala', 
            totalDebt: 75000,
            phone: '+243 345 678 901',
            debts: [
                { id: 1, name: 'Antibiotique large spectre', quantity: 1, price: 35000, total: 35000, date: '2024-01-25' },
                { id: 2, name: 'Antipyrétique', quantity: 4, price: 10000, total: 40000, date: '2024-02-05' },
            ]
        },
        { 
            id: 4, 
            name: 'Anne Kanza', 
            totalDebt: 15000,
            phone: '+243 456 789 012',
            debts: [
                { id: 1, name: 'Sirop toux', quantity: 2, price: 7500, total: 15000, date: '2024-02-12' },
            ]
        },
    ])

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return(<>
    <div className="flex-1 h-full flex gap-3">
        {/* Left side - Customer list */}
        <div className="w-[35%] h-full flex flex-col">
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
                                <p className="text-xs text-gray-500">{customer.phone}</p>
                                <p className="text-sm text-orange-600 font-medium mt-1">{number.format(customer.totalDebt)} FC</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right side - Customer debts details */}
        <div className="flex-1 h-full overflow-auto">
            {selectedCustomer ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                            </div>
                        </div>
                        
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Dette totale</span>
                                <span className="text-2xl font-bold text-orange-600">{number.format(selectedCustomer.totalDebt)} FC</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des dettes</h3>
                        <div className="space-y-3">
                            {selectedCustomer.debts.map((debt, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{debt.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{debt.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{number.format(debt.total)} FC</p>
                                            <p className="text-xs text-gray-500">Qté: {debt.quantity} × {number.format(debt.price)} FC</p>
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
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Sélectionnez un client</p>
                        <p className="text-sm text-gray-400 mt-1">Choisissez un client pour voir ses dettes</p>
                    </div>
                </div>
            )}
        </div>
    </div>
    </>)
}
