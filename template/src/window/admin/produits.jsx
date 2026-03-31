import { useState, useEffect } from 'react'
import { Package, Plus, Edit, Trash2, Search, AlertTriangle, Eye } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { Input, InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"
import { famillieService } from '../../services/admin/famillie_service'
import { useForm } from 'react-hook-form'
import { Select as SelectCustom } from '../../components/ui/input/select'
import { produitService } from '../../services/admin/produit_service'
import { formatDateToDMY, isExpiringSoon } from '../../hooks/format_date'
import { calculateStockStatus } from '../../hooks/calcul'
import ConfirmModal from '../../components/common/modal/confirme'


export default function Produits() {

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [families, setFamilies] = useState([])
    const [medicaments, setMedicaments] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [openModal, setOpenModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)

    useEffect(() => {
        const res = async () => {
            const data = await famillieService.get()
            setFamilies(data)
            const medicamentsData = await produitService.get()
            setMedicaments(medicamentsData)
        }
        res()
    }, [loading])


    const {
        register: registerAdd,
        handleSubmit: handleSubmitAdd,
        formState: { errors: errorsAdd },
        reset: resetAdd,
    } = useForm()

    const handleAddProduct = async (data) => {
        const success = await produitService.add(data)
        if(success) { 
            resetAdd()
            setLoading(!loading)
            setOpenModal(false)
        }
    }


    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: { errors: errorsUpdate },
        reset: resetUpdate,
    } = useForm()

    const handleEditProduct = async (data) => {
        const success = await produitService.update(data, selectIdProduit)
        if(success) { 
            resetUpdate()
            setLoading(!loading)
            setEditModal(false)
        }
    }
    
    const [cacheEdit, setCacheEdit] = useState()
    const [selectIdProduit, setSelectIdProduit] = useState()
    const openEditModal = (product) => {
        setCacheEdit(product.family_id)
        setSelectIdProduit(product.id)
        resetUpdate({
            name: product.medicament_name,
            prixAchat: product.price_buy,
            prixVente: product.price_sell,
        })
        setEditModal(true)
    }
    
    
    const openViewModal = (product) => {
        setSelectedProduct(product)
        setViewModal(true)
    }
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const handleDeleteProduct = (id) => {
        setProductIdToDelete(id);
        setShowConfirmModal(true);
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
                    <p className="text-sm text-gray-600 mt-1">Gérez votre catalogue de médicaments</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{medicaments?.data?.length} produits</span>
                    </div>
                    <Bouton 
                        onClick={() => setOpenModal(true)}
                        primary>
                        <Plus className="w-4 h-4" />
                        Nouveau produit
                    </Bouton>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6">
                <div className="flex-1">
                    <Input 
                        icons={<Search className="text-gray-400 w-5 h-5" />} 
                        placeholder="Rechercher un produit, remarque..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tableau des produits */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Produit</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Catégorie</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Prix d'achat</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Prix de vente</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Expiration</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {medicaments?.data?.map((product, index) => {
                                const view = product.medicament_name.toLowerCase().includes(searchTerm.toLowerCase())
                                return (
                                    <tr key={index} className={`hover:bg-gray-50 ${ view ? '' : 'hidden' }`}>
                                        <td className="py-3 px-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{product.medicament_name}</h4>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-900">{product.family_name}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                    ${calculateStockStatus(product.stock, product.last_stock).color}
                                                    ${calculateStockStatus(product.stock, product.last_stock).bgColor}`}>
                                                    {product.stock}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium text-gray-900">{product.price_buy} FC</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium text-emerald-600">{product.price_sell} FC</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`
                                                    text-sm ${isExpiringSoon(product.date_expiration) == "expirer" ? 'text-red-500' : 'text-gray-900'} `}>{formatDateToDMY(product.date_expiration)}</span>
                                                { isExpiringSoon(product.date_expiration) == "bientot" && <AlertTriangle className="w-4 h-4 text-orange-500" title="Expire bientôt" /> }
                                                { isExpiringSoon(product.date_expiration) == "expirer" && <AlertTriangle className="w-4 h-4 text-red-500" title="Expire bientôt" /> }
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => openViewModal(product)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="Voir les détails"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(product)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======================================================================================== */}

            {/* Modal Ajout */}
            <Modal open={openModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitAdd(handleAddProduct)} className="bg-white border border-gray-300 w-full max-w-2xl p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Ajouter un nouveau produit</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <InputLabel 
                            type="text"
                            label="Nom du produit *"
                            placeholder="Ex: Paracétamol 500mg"
                            {...registerAdd('name', {
                                required: 'Le nom du produit est obligatoire',
                                minLength: {    
                                    value: 2,
                                    message: 'Le nom du produit doit contenir au moins 2 caractères'
                                }
                            })}
                            error={!!errorsAdd.name}
                            helperText={errorsAdd.name?.message}
                        />
                        <SelectCustom
                            {...registerAdd('family', { 
                                required: 'Veuillez choisir une catégorie'
                            })}
                            label="Catégorie *"
                            placeholder="Choisir une catégorie"
                            error={!!errorsAdd.family}
                            helperText={errorsAdd.family?.message}
                        >
                            {families?.data?.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </SelectCustom>
                        <InputLabel 
                            type="number"
                            label="Quantité *"
                            placeholder="0"
                            {...registerAdd('quantite', {
                                required: 'La quantité est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'La quantité doit être positive'
                                }
                            })}
                            error={!!errorsAdd.quantite}
                            helperText={errorsAdd.quantite?.message}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix d'achat (FC) *"
                            placeholder="0"
                            {...registerAdd('prixAchat', {
                                required: 'Le prix d\'achat est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'Le prix doit être positif'
                                }
                            })}
                            error={!!errorsAdd.prixAchat}
                            helperText={errorsAdd.prixAchat?.message}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix de vente (FC) *"
                            placeholder="0"
                            {...registerAdd('prixVente', {
                                required: 'Le prix de vente est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'Le prix doit être positif'
                                }
                            })}
                            error={!!errorsAdd.prixVente}
                            helperText={errorsAdd.prixVente?.message}
                        />
                        <InputLabel 
                            type="date"
                            label="Date d'expiration *"
                            {...registerAdd('dateExpiration', {
                                required: 'La date d\'expiration est obligatoire'
                            })}
                            error={!!errorsAdd.dateExpiration}
                            helperText={errorsAdd.dateExpiration?.message}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton primary type="submit" className="flex-1">
                            Ajouter le produit
                        </Bouton>
                        <Bouton className="flex-1" outline onClick={() => setOpenModal(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>

            {/* Modal Modification */}
            <Modal open={editModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitUpdate(handleEditProduct)} className="bg-white border border-gray-300 w-full max-w-2xl p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Modifier le produit</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <InputLabel 
                            type="text"
                            label="Nom du produit *"
                            placeholder="Ex: Paracétamol 500mg"
                            {...registerUpdate('name', {
                                required: 'Le nom du produit est obligatoire',
                                minLength: {    
                                    value: 2,
                                    message: 'Le nom du produit doit contenir au moins 2 caractères'
                                }
                            })}
                            error={!!errorsUpdate.name}
                            helperText={errorsUpdate.name?.message}
                        />
                        <SelectCustom
                            {...registerUpdate('family', { 
                                required: 'Veuillez choisir une catégorie'
                            })}
                            label="Catégorie *"
                            placeholder="Choisir une catégorie"
                            defaultValue={cacheEdit}
                            error={!!errorsUpdate.family}
                            helperText={errorsUpdate.family?.message}
                        >
                            {families?.data?.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </SelectCustom>
                        <InputLabel 
                            type="number"
                            label="Prix d'achat (FC) *"
                            placeholder="0"
                            {...registerUpdate('prixAchat', {
                                required: 'Le prix d\'achat est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'Le prix doit être positif'
                                }
                            })}
                            error={!!errorsUpdate.prixAchat}
                            helperText={errorsUpdate.prixAchat?.message}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix de vente (FC) *"
                            placeholder="0"
                            {...registerUpdate('prixVente', {
                                required: 'Le prix de vente est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'Le prix doit être positif'
                                }
                            })}
                            error={!!errorsUpdate.prixVente}
                            helperText={errorsUpdate.prixVente?.message}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton primary type="submit" className="flex-1">
                            Sauvegarder les modifications
                        </Bouton>
                        <Bouton className="flex-1" outline onClick={() => setEditModal(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>

            {/* Modal Vue */}
            <Modal open={viewModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-full max-w-lg p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Détails du produit</h2>
                    {selectedProduct && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                                <p className="text-gray-900 font-medium">{selectedProduct.medicament_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <p className="text-gray-900">{selectedProduct.family_name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en stock</label>
                                    <p className={`
                                        ${calculateStockStatus(selectedProduct.stock, selectedProduct.last_stock).color} font-medium`}>{selectedProduct.stock}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat</label>
                                    <p className="text-gray-900 font-medium">{selectedProduct.price_buy} FC</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente</label>
                                    <p className="text-emerald-600 font-medium">{selectedProduct.price_sell} FC</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                                <div className='flex gap-2 items-center'>
                                    <p className={ isExpiringSoon(selectedProduct.date_expiration) == "expirer" ? 'text-red-500' : 'text-gray-900'}>{formatDateToDMY(selectedProduct.date_expiration)}</p>
                                    { isExpiringSoon(selectedProduct.date_expiration) && <AlertTriangle className="w-4 h-4 text-orange-500" title="Expire bientôt" /> }
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton className="flex-1" outline onClick={() => setViewModal(false)}>
                            Fermer
                        </Bouton>
                        <Bouton primary className="flex-1" onClick={() => {
                            setViewModal(false)
                            openEditModal(selectedProduct)
                        }}>
                            Modifier
                        </Bouton>
                    </div>
                </div>
            </Modal>


            {/* modal de confirmation */}
            <ConfirmModal 
                open={showConfirmModal}
                onConfirm={async () => {
                    const success = await produitService.delete(productIdToDelete)
                    if(success) { 
                        setLoading(!loading)
                    }
                    setShowConfirmModal(false);
                }}
                onCancel={() => setShowConfirmModal(false)}
                title="Supprimer du medicament"
                message="Êtes-vous sûr de vouloir supprimer ce medicament ?"
            />
        </div>
    )
}
