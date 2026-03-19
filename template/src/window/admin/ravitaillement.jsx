import { useState } from 'react'
import { Package, Plus, AlertTriangle, Calendar, Search, Filter } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"

export default function Ravitaillement() {
    const [filter, setFilter] = useState('all') // 'all', 'low_stock', 'expired'
    const [searchTerm, setSearchTerm] = useState('')
    const [openStockModal, setOpenStockModal] = useState(false)
    const [openExpiryModal, setOpenExpiryModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    
    // Données simulées pour les médicaments
    const [medicaments, setMedicaments] = useState([
        {
            id: 1,
            nom: 'Amoxicilline 1g',
            categorie: 'Antibiotiques',
            quantite: 8,
            stockMin: 20,
            prixUnitaire: 1200,
            dateExpiration: '2024-06-15',
            statut: 'low_stock'
        },
        {
            id: 2,
            nom: 'Paracétamol 500mg',
            categorie: 'Antalgiques',
            quantite: 150,
            stockMin: 50,
            prixUnitaire: 150,
            dateExpiration: '2025-12-31',
            statut: 'normal'
        },
        {
            id: 3,
            nom: 'Ibuprofène 400mg',
            categorie: 'Anti-inflammatoires',
            quantite: 12,
            stockMin: 15,
            prixUnitaire: 350,
            dateExpiration: '2024-03-20',
            statut: 'expired'
        },
        {
            id: 4,
            nom: 'Vitamine C 500mg',
            categorie: 'Vitamines',
            quantite: 200,
            stockMin: 100,
            prixUnitaire: 200,
            dateExpiration: '2025-08-15',
            statut: 'normal'
        },
        {
            id: 5,
            nom: 'Doliprane 1000mg',
            categorie: 'Antalgiques',
            quantite: 5,
            stockMin: 20,
            prixUnitaire: 320,
            dateExpiration: '2024-04-10',
            statut: 'low_stock'
        }
    ])

    const [stockForm, setStockForm] = useState({
        quantite: '',
        raison: ''
    })

    const [expiryForm, setExpiryForm] = useState({
        nouvelleDate: '',
        raison: ''
    })

    // Filtrer les médicaments selon le filtre sélectionné et la recherche
    const filteredMedicaments = medicaments.filter(medicament => {
        const matchesFilter = filter === 'all' || 
            (filter === 'low_stock' && medicament.statut === 'low_stock') ||
            (filter === 'expired' && medicament.statut === 'expired')
        
        const matchesSearch = searchTerm === '' || 
            medicament.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicament.categorie.toLowerCase().includes(searchTerm.toLowerCase())
        
        return matchesFilter && matchesSearch
    })

    const handleAddStock = (medicament) => {
        setSelectedProduct(medicament)
        setStockForm({
            quantite: '',
            raison: ''
        })
        setOpenStockModal(true)
    }

    const handleUpdateExpiry = (medicament) => {
        setSelectedProduct(medicament)
        setExpiryForm({
            nouvelleDate: medicament.dateExpiration,
            raison: ''
        })
        setOpenExpiryModal(true)
    }

    const confirmAddStock = () => {
        setMedicaments(prev => prev.map(med => 
            med.id === selectedProduct.id 
                ? { 
                    ...med, 
                    quantite: med.quantite + parseInt(stockForm.quantite),
                    statut: med.quantite + parseInt(stockForm.quantite) > med.stockMin ? 'normal' : med.statut
                  }
                : med
        ))
        setOpenStockModal(false)
        setSelectedProduct(null)
        setStockForm({ quantite: '', raison: '' })
    }

    const confirmUpdateExpiry = () => {
        setMedicaments(prev => prev.map(med => 
            med.id === selectedProduct.id 
                ? { 
                    ...med, 
                    dateExpiration: expiryForm.nouvelleDate,
                    statut: new Date(expiryForm.nouvelleDate) > new Date() && med.quantite > med.stockMin ? 'normal' : med.statut
                  }
                : med
        ))
        setOpenExpiryModal(false)
        setSelectedProduct(null)
        setExpiryForm({ nouvelleDate: '', raison: '' })
    }

    const getStatutBadge = (statut) => {
        const statusClasses = {
            'normal': 'bg-green-100 text-green-800',
            'low_stock': 'bg-orange-100 text-orange-800',
            'expired': 'bg-red-100 text-red-800'
        }
        
        const statusLabels = {
            'normal': 'En stock',
            'low_stock': 'Stock faible',
            'expired': 'Expiré'
        }
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[statut]}`}>
                {statusLabels[statut]}
            </span>
        )
    }

    const isExpired = (date) => {
        return new Date(date) < new Date()
    }

    const isLowStock = (quantite, stockMin) => {
        return quantite <= stockMin
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ravitaillement</h1>
                    <p className="text-gray-600">Gérez les stocks et dates d'expiration</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filtrer:</span>
                        </div>
                        <div className="flex gap-2">
                            <Bouton 
                                outline={filter !== 'all'}
                                primary={filter === 'all'}
                                className="text-sm"
                                onClick={() => setFilter('all')}
                            >
                                Tous les médicaments
                            </Bouton>
                            <Bouton 
                                outline={filter !== 'low_stock'}
                                primary={filter === 'low_stock'}
                                className="text-sm"
                                onClick={() => setFilter('low_stock')}
                            >
                                Stock faible
                            </Bouton>
                            <Bouton 
                                outline={filter !== 'expired'}
                                primary={filter === 'expired'}
                                className="text-sm"
                                onClick={() => setFilter('expired')}
                            >
                                Expirés
                            </Bouton>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Rechercher un médicament..."
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">En stock</p>
                            <p className="text-xl font-bold text-gray-900">
                                {medicaments.filter(m => m.statut === 'normal').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Stock faible</p>
                            <p className="text-xl font-bold text-gray-900">
                                {medicaments.filter(m => m.statut === 'low_stock').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Expirés</p>
                            <p className="text-xl font-bold text-gray-900">
                                {medicaments.filter(m => m.statut === 'expired').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des médicaments */}
            <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {filter === 'all' && 'Tous les médicaments'}
                        {filter === 'low_stock' && 'Médicaments à stock faible'}
                        {filter === 'expired' && 'Médicaments expirés'}
                        <span className="text-sm text-gray-600 ml-2">({filteredMedicaments.length})</span>
                    </h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Médicament
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Catégorie
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock actuel
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date d'expiration
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMedicaments.map((medicament) => (
                                <tr key={medicament.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{medicament.nom}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-600">{medicament.categorie}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{medicament.quantite}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className={`text-sm ${
                                                isExpired(medicament.dateExpiration) 
                                                    ? 'text-red-600' 
                                                    : 'text-gray-900'
                                            }`}>
                                                {medicament.dateExpiration}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {getStatutBadge(medicament.statut)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Bouton 
                                                primary 
                                                className="text-sm"
                                                onClick={() => handleAddStock(medicament)}
                                            >
                                                <Plus className="w-3 h-3" />
                                                Ajouter stock
                                            </Bouton>
                                            {isExpired(medicament.dateExpiration) && (
                                                <Bouton 
                                                    outline 
                                                    className="text-sm"
                                                    onClick={() => handleUpdateExpiry(medicament)}
                                                >
                                                    <Calendar className="w-3 h-3" />
                                                    Modifier date
                                                </Bouton>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal pour ajouter du stock */}
            <Modal open={openStockModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Ajouter du stock</h2>
                    
                    {selectedProduct && (
                        <div className="mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{selectedProduct.nom}</p>
                                <p className="text-sm text-gray-600">
                                    Stock actuel: {selectedProduct.quantite} | Stock minimum: {selectedProduct.stockMin}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <InputLabel 
                            type="number"
                            label="Quantité à ajouter"
                            placeholder="0"
                            value={stockForm.quantite}
                            onChange={(e) => setStockForm({...stockForm, quantite: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton outline className="flex-1" onClick={() => setOpenStockModal(false)}>
                            Annuler
                        </Bouton>
                        <Bouton primary className="flex-1" onClick={confirmAddStock}>
                            Confirmer
                        </Bouton>
                    </div>
                </div>
            </Modal>

            {/* Modal pour modifier la date d'expiration */}
            <Modal open={openExpiryModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Modifier la date d'expiration</h2>
                    
                    {selectedProduct && (
                        <div className="mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{selectedProduct.nom}</p>
                                <p className="text-sm text-gray-600">
                                    Date actuelle: {selectedProduct.dateExpiration}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <InputLabel 
                            type="date"
                            label="Nouvelle date d'expiration"
                            value={expiryForm.nouvelleDate}
                            onChange={(e) => setExpiryForm({...expiryForm, nouvelleDate: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton outline className="flex-1" onClick={() => setOpenExpiryModal(false)}>
                            Annuler
                        </Bouton>
                        <Bouton primary className="flex-1" onClick={confirmUpdateExpiry}>
                            Confirmer
                        </Bouton>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
