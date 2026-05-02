import { useState, useEffect } from 'react'
import { Package, Plus, AlertTriangle, Calendar, Search, Filter } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"
import { produitService } from '../../services/admin/produit_service'
import { calculateStockStatus } from '../../hooks/calcul'
import { formatDateToDMY, isExpiringSoon, isExpired } from '../../hooks/format_date'
import { useForm } from 'react-hook-form'

export default function Ravitaillement() {

    const [medicament, setMedicament] = useState([])
    const [filter, setFilter] = useState('all') // 'all', 'low_stock', 'expired'
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)

    const [choix_btn, setChoix_btn] = useState()

    const [openStockModal, setOpenStockModal] = useState(false)
     const [openExpiryModal, setOpenExpiryModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    useEffect(()=> {
        (async()=> {
            const res = await produitService.get()
            setMedicament(res.data)
        })()
    },[loading])
    
    const {
        register: registerStock,
        handleSubmit: handleSubmitStock,
        formState: { errors: errorsStock },
        reset: resetStock,
    } = useForm()

    const handleAddSoustrStock = async (data) => {
        const newData = {
            ...data,
            id: selectedProduct.id,
            choix: choix_btn
        }
        const success = await produitService.addStock(newData)
        if(success) { 
            resetStock()
            setLoading(!loading)
            setOpenStockModal(false)
        }
    }


    const {
        register: registerDate,
        handleSubmit: handleSubmitDate,
        formState: { errors: errorsDate },
        reset: resetDate,
    } = useForm()

    const handleAddDate = async (data) => {
        const newData = {
            ...data,
            id: selectedProduct.id
        }
        const success = await produitService.updateExpiry(newData)
        if(success) { 
            resetDate()
            setLoading(!loading)
            setOpenExpiryModal(false)
        }
    }

    // Filtrer les médicaments selon le filtre sélectionné et la recherche
    const filteredMedicaments = medicament?.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'low_stock' && ((item.stock / item.last_stock) * 100) <= 45) ||
            (filter === 'expired' && isExpiringSoon(item.date_expiration))
        
        const matchesSearch = searchTerm === '' || 
            item.medicament_name.toLowerCase().includes(searchTerm.toLowerCase())
        
        return matchesFilter && matchesSearch
    })

    const getStatutBadge = (value) => {

        const stock = ((value.stock / value.last_stock) * 100) <= 45;
        const expired_before = isExpiringSoon(value.date_expiration);
        const expired = isExpired(value.date_expiration);

        const statut = stock ? 'low_stock' : ( expired ? 'expired' : expired_before ? 'expiring_soon' : 'normal');


        const statusClasses = {
            'normal': 'bg-green-100 text-green-800',
            'low_stock': 'bg-orange-100 text-orange-800',
            'expired': 'bg-red-100 text-red-800',
            'expiring_soon': 'bg-yellow-100 text-yellow-800'
        }
        
        const statusLabels = {
            'normal': 'En stock',
            'low_stock': 'Faible',
            'expired': 'Expiré',
            'expiring_soon': 'Expire bientôt'
        }
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[statut]}`}>
                {statusLabels[statut]}
            </span>
        )
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
                                Expirés ou expire bientôt
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
                                {medicament.filter(m => ((m.stock / m.last_stock) * 100) > 45).length}
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
                                {medicament.filter(m => ((m.stock / m.last_stock) * 100) <= 45).length}
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
                            <p className="text-sm text-gray-600">Expirés ou expire bientôt</p>
                            <p className="text-xl font-bold text-gray-900">
                                {medicament.filter(m => isExpiringSoon(m.date_expiration)).length}
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
                            {filteredMedicaments?.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.medicament_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                                            ${calculateStockStatus(item.stock, item.last_stock).color}
                                            ${calculateStockStatus(item.stock, item.last_stock).bgColor}`}>
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className={`
                                                text-sm ${isExpiringSoon(item.date_expiration) == "expirer" ? 'text-red-500' : 'text-gray-900'} `}>{formatDateToDMY(item.date_expiration)}</span>
                                            { isExpiringSoon(item.date_expiration) == "bientot" && <AlertTriangle className="w-4 h-4 text-orange-500" title="Expire bientôt" /> }
                                            { isExpiringSoon(item.date_expiration) == "expirer" && <AlertTriangle className="w-4 h-4 text-red-500" title="Expire bientôt" /> }
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {getStatutBadge(item)}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <Bouton 
                                                className="px-4"
                                                onClick={() => {
                                                    setChoix_btn('ajouter')
                                                    setOpenStockModal(true)
                                                    setSelectedProduct(item)
                                                }}
                                            >
                                                Add
                                            </Bouton>

                                            <Bouton  
                                                outline
                                                className="px-4"
                                                onClick={() => {
                                                    setChoix_btn('soustraire')
                                                    setOpenStockModal(true)
                                                    setSelectedProduct(item)
                                                }}
                                            >
                                                Soustr
                                            </Bouton>
                                            
                                            {isExpiringSoon(item.date_expiration) && (
                                                <Bouton 
                                                    outline 
                                                    className="text-sm"
                                                    onClick={() => {
                                                        setOpenExpiryModal(true)
                                                        setSelectedProduct(item)
                                                    }}
                                                >
                                                    <Calendar className="w-3 h-3" />
                                                    Màj
                                                </Bouton>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    { filteredMedicaments?.length === 0 &&
                    (<div className='flex items-center justify-center flex-col text-center w-full h-40'>
                        <Package className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600">Aucun produit trouvé</p>
                    </div>) }
                </div>
            </div>

            {/* Modal pour ajouter du stock */}
            <Modal open={openStockModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitStock(handleAddSoustrStock)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Ajouter du stock</h2>
                    
                    {selectedProduct && (
                        <div className="mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{selectedProduct.medicament_name}</p>
                                <p className="text-sm text-gray-600">
                                    Stock actuel: {selectedProduct.stock}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <InputLabel 
                            type="number"
                            label={"Quantité à" + " " + choix_btn}
                            placeholder="0"
                            {...registerStock('quantite', {
                                required: 'La quantité est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'La quantité doit être positive'
                                }
                            })}
                            error={!!errorsStock.quantite}
                            helperText={errorsStock.quantite?.message}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton type='submit' primary className="flex-1">
                            Confirmer
                        </Bouton>
                        <Bouton outline className="flex-1" onClick={() => setOpenStockModal(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>

            {/* Modal pour modifier la date d'expiration */}
            <Modal open={openExpiryModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitDate(handleAddDate)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Modifier la date d'expiration</h2>
                    
                    {selectedProduct && (
                        <div className="mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{selectedProduct.medicament_name}</p>
                                <p className="text-sm text-red-600">
                                    Date actuelle: {formatDateToDMY(selectedProduct.date_expiration)}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <InputLabel 
                            type="date"
                            label="Nouvelle date d'expiration"
                            {...registerDate('nouvelleDate', {
                                required: 'La date est obligatoire',
                                min: {
                                    value: new Date().toISOString().split('T')[0],
                                    message: 'La date doit être dans le futur'
                                }
                            })}
                            error={!!errorsDate.nouvelleDate}
                            helperText={errorsDate.nouvelleDate?.message}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton type="submit" primary className="flex-1">
                            Confirmer
                        </Bouton>
                        <Bouton outline className="flex-1" onClick={() => setOpenExpiryModal(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
