import { useState } from 'react'
import { Package, Plus, Building2, ChevronDown,XCircle, User, MapPin } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from './../../components/ui/input/select-ui'
import Modal from "@mui/material/Modal"

const items = [
    { label: "Select a fruit", value: null },
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
]

export default function Acquisition() {

    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [openM, setOpenM] = useState(false)
    const [openC, setOpenC] = useState(false)

    // Données de test pour les approvisionnements
    const suppliers = [
        { 
            id: 1, 
            name: 'PharmaCentrale', 
            email: 'contact@pharmacentrale.com',
            phone: '+243 123 456 789',
            address: 'Kinshasa, Gombe',
            products: [
                { id: 1, name: 'Paracétamol 500mg', price: 150, stock: 500, category: 'Antalgique' },
                { id: 2, name: 'Amoxicilline 1g', price: 1200, stock: 200, category: 'Antibiotique' },
                { id: 3, name: 'Ibuprofène 400mg', price: 280, stock: 350, category: 'Anti-inflammatoire' },
                { id: 4, name: 'Doliprane 1000mg', price: 320, stock: 150, category: 'Antalgique' },
                { id: 5, name: 'Aspirine 100mg', price: 160, stock: 400, category: 'Antalgique' },
                { id: 6, name: 'Vitamine C 500mg', price: 80, stock: 600, category: 'Vitamine' },
                { id: 7, name: 'Augmentin 625mg', price: 1800, stock: 100, category: 'Antibiotique' },
                { id: 8, name: 'Arthotec 50mg', price: 450, stock: 80, category: 'Anti-inflammatoire' }
            ],
            orders: [
                { id: 1, product: 'Paracétamol 500mg', quantity: 100, status: 'En attente', date: '2024-03-16' },
                { id: 2, product: 'Amoxicilline 1g', quantity: 50, status: 'Livré', date: '2024-03-15' }
            ]
        },
        { 
            id: 2, 
            name: 'MediSupply', 
            email: 'info@medisupply.com',
            phone: '+243 987 654 321',
            address: 'Kinshasa, Limete',
            products: [
                { id: 9, name: 'Métamizole 500mg', price: 220, stock: 300, category: 'Antalgique' },
                { id: 10, name: 'Ciprofloxacine 500mg', price: 1500, stock: 180, category: 'Antibiotique' },
                { id: 11, name: 'Diclofénac 50mg', price: 380, stock: 250, category: 'Anti-inflammatoire' },
                { id: 12, name: 'Prednisone 5mg', price: 650, stock: 120, category: 'Corticoïde' },
                { id: 13, name: 'Omeprazole 20mg', price: 450, stock: 200, category: 'Anti-ulcéreux' },
                { id: 14, name: 'Salbutamol 100µg', price: 850, stock: 90, category: 'Bronchodilatateur' }
            ],
            orders: [
                { id: 3, product: 'Ibuprofène 400mg', quantity: 75, status: 'En cours', date: '2024-03-16' },
                { id: 4, product: 'Métamizole 500mg', quantity: 120, status: 'En attente', date: '2024-03-17' }
            ]
        },
        { 
            id: 3, 
            name: 'GlobalPharma', 
            email: 'sales@globalpharma.com',
            phone: '+243 555 123 456',
            address: 'Kinshasa, Matete',
            products: [
                { id: 15, name: 'Lévofloxacine 500mg', price: 2200, stock: 80, category: 'Antibiotique' },
                { id: 16, name: 'Kétoprofène 100mg', price: 520, stock: 150, category: 'Anti-inflammatoire' },
                { id: 17, name: 'Tramadol 50mg', price: 950, stock: 200, category: 'Antalgique fort' },
                { id: 18, name: 'Insuline Glargine', price: 15000, stock: 30, category: 'Diabète' },
                { id: 19, name: 'Metformine 850mg', price: 380, stock: 400, category: 'Diabète' }
            ],
            orders: [
                { id: 5, product: 'Lévofloxacine 500mg', quantity: 40, status: 'Livré', date: '2024-03-14' }
            ]
        }
    ]

    return (<>
    <div className="flex-1 p-2.5 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Acquisition</h2>
                <p className="text-sm text-gray-600 mt-1">Gérez vos approvisionnements</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{suppliers.length} fournisseurs</span>
                </div>
                <Bouton 
                    onClick={() => setOpenM(true)}
                    primary>
                    <Plus className="w-4 h-4" />
                    Nouveau fournisseur
                </Bouton>
            </div>
        </div>

        <div className="space-y-2">
            {suppliers.map(supplier => (
                <div key={supplier.id} className="border border-gray-300 rounded-xl overflow-hidden transition-shadow">
                    {/* Header fournisseur */}
                    <div 
                        onClick={() => setSelectedSupplier(selectedSupplier === supplier.id ? null : supplier.id)}
                        className="p-3 bg-emerald-50/50 hover:bg-emerald-50 border-b border-gray-200 cursor-pointer transition-colors">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-gray-200" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                                    <p className="text-sm text-gray-600">localisation: Lemba</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{supplier.products.length} produits</span>
                                <div className={`transform transition-transform duration-200 ${selectedSupplier === supplier.id ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Détails déroulants */}
                    {selectedSupplier === supplier.id && (
                        <div className="border-t border-gray-100">

                            {/* Produits disponibles */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-900">Produits ({supplier.products.length})</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                                    {supplier.products.map(product => (
                                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-medium text-gray-900 text-sm">{product.name}</h5>
                                                <button 
                                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                                    title="Annuler la vente">
                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-600">
                                                <span>{product.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Commandes */}
                            <div className="p-4">
                                <Bouton outline
                                    onClick={() => setOpenC(true)}
                                    className='w-full'>
                                    <Plus className="w-4 h-4" />
                                    Nouvelle commande
                                </Bouton>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>

    {/* =========================================================== */}
    {/* MODAL ADD FOURNISSEUR */}
    <Modal 
        open={openM}
        // onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
            <h2 className="text-xl font-semibold mb-5">Ajouter un fournisseur</h2>

            <div className='space-y-2'>
                <InputLabel label="Nom du fournisseur"
                    icons={User} 
                    type="text" />
                <InputLabel label="Adresse du fournisseur"
                    icons={MapPin} 
                    type="text" />
            </div>
            
            <div className="flex gap-2 mt-6">
                <Bouton className="w-full" outline
                    onClick={() => setOpenM(false)}>
                    Annuler
                </Bouton>
                <Bouton primary
                    onClick={() => setOpenM(false)} 
                    className="w-full">
                    Confirmation
                </Bouton>
            </div>
        </div>
    </Modal>
    {/* MODAL ADD NEW COMMANDE */}

    <Modal 
        open={openC}
        // onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
            <h2 className="text-xl font-semibold mb-5">Ajouter une nouvelle commande</h2>

            <div className='space-y-2'>
                <InputLabel label="Nom du produit"
                    icons={Package} 
                    type="text" />
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Catégorie</label>
                    <Select items={items} defaultValue={null}>
                        <SelectTrigger icons={Package}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
            </div>
            
            <div className="flex gap-2 mt-6">
                <Bouton className="w-full" outline
                    onClick={() => setOpenC(false)}>
                    Annuler
                </Bouton>
                <Bouton primary
                    onClick={() => setOpenC(false)} 
                    className="w-full">
                    Confirmation
                </Bouton>
            </div>
        </div>
    </Modal>

</>);
}