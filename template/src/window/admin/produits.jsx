import { useState, useEffect } from 'react'
import { Package, Plus, Edit, Trash2, Search, AlertTriangle, Eye } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { Input, InputLabel } from '../../components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../../components/ui/input/select-ui'
import Modal from "@mui/material/Modal"
import { famillieService } from '../../services/admin/famillie_service'
import { useForm } from 'react-hook-form'
import { Select as SelectCustom } from '../../components/ui/input/select'
import { produitService } from '../../services/admin/produit_service'


// Catégories par défaut (non supprimables)
const defaultCategories = [
    'Antibiotiques',
    'Antalgiques', 
    'Anti-inflammatoires',
    'Vitamines',
    'Corticoïdes',
    'Anti-ulcéreux',
    'Bronchodilatateurs'
]

// Données simulées
const initialProducts = [
    {
        id: 1,
        nom: 'Paracétamol 500mg',
        categorie: 'Antalgiques',
        quantite: 156,
        prixAchat: 150,
        prixVente: 200,
        dateExpiration: '2024-12-31',
        remarque: 'Conditionnement de 20 comprimés',
        minStock: 20
    },
    {
        id: 2,
        nom: 'Amoxicilline 1g',
        categorie: 'Antibiotiques',
        quantite: 12,
        prixAchat: 800,
        prixVente: 1200,
        dateExpiration: '2024-08-15',
        remarque: 'Antibiotique large spectre',
        minStock: 20
    },
    {
        id: 3,
        nom: 'Ibuprofène 400mg',
        categorie: 'Anti-inflammatoires',
        quantite: 89,
        prixAchat: 250,
        prixVente: 350,
        dateExpiration: '2025-02-28',
        remarque: 'Anti-inflammatoire non stéroïdien',
        minStock: 15
    }
]

const categories = [
    ...defaultCategories,
    'Autres'
]

export default function Produits() {

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [families, setFamilies] = useState([])
    const [medicaments, setMedicaments] = useState([])

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



    const [products, setProducts] = useState(initialProducts)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [formData, setFormData] = useState({
        nom: '',
        categorie: '',
        quantite: '',
        prixAchat: '',
        prixVente: '',
        dateExpiration: '',
        remarque: '',
        minStock: ''
    })

    

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.remarque.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || product.categorie === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleAddProducts = () => {
        const newProduct = {
            id: products.length + 1,
            ...formData,
            quantite: parseInt(formData.quantite),
            prixAchat: parseFloat(formData.prixAchat),
            prixVente: parseFloat(formData.prixVente),
            minStock: parseInt(formData.minStock)
        }
        setProducts([...products, newProduct])
        resetForm()
        setOpenModal(false)
    }

    const handleEditProduct = () => {
        const updatedProducts = products.map(product =>
            product.id === selectedProduct.id
                ? {
                    ...product,
                    ...formData,
                    quantite: parseInt(formData.quantite),
                    prixAchat: parseFloat(formData.prixAchat),
                    prixVente: parseFloat(formData.prixVente),
                    minStock: parseInt(formData.minStock)
                }
                : product
        )
        setProducts(updatedProducts)
        resetForm()
        setEditModal(false)
    }

    const handleDeleteProduct = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            setProducts(products.filter(product => product.id !== id))
        }
    }

    const openEditModal = (product) => {
        setSelectedProduct(product)
        setFormData({
            nom: product.nom,
            categorie: product.categorie,
            quantite: product.quantite.toString(),
            prixAchat: product.prixAchat.toString(),
            prixVente: product.prixVente.toString(),
            dateExpiration: product.dateExpiration,
            remarque: product.remarque,
            minStock: product.minStock.toString()
        })
        setEditModal(true)
    }

    const openViewModal = (product) => {
        setSelectedProduct(product)
        setViewModal(true)
    }

    const resetForm = () => {
        setFormData({
            nom: '',
            categorie: '',
            quantite: '',
            prixAchat: '',
            prixVente: '',
            dateExpiration: '',
            remarque: '',
            minStock: ''
        })
    }

    const getStockStatus = (product) => {
        if (product.quantite === 0) return { color: 'text-red-600 bg-red-100', text: 'Rupture' }
        if (product.quantite <= product.minStock) return { color: 'text-orange-600 bg-orange-100', text: 'Stock faible' }
        return { color: 'text-emerald-600 bg-emerald-100', text: 'En stock' }
    }

    const isExpiringSoon = (dateExpiration) => {
        const expDate = new Date(dateExpiration)
        const today = new Date()
        const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 30
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
                        onClick={() => {
                            resetForm()
                            setOpenModal(true)
                        }}
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
                                                    text-emerald-600 bg-emerald-100
                                                    `}>
                                                        {/* text-orange-600 bg-orange-100 */}
                                                        {/* text-red-600 bg-red-100 */}
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
                                                <span className="text-sm text-gray-900">{product.date_expiration}</span>
                                                <AlertTriangle className="w-4 h-4 text-orange-500" title="Expire bientôt" />
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
                <div className="bg-white border border-gray-300 w-full max-w-2xl p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Modifier le produit</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <InputLabel 
                            type="text"
                            label="Nom du produit *"
                            placeholder="Nom du produit"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                            <Select 
                                items={categories.map(cat => ({ label: cat, value: cat }))} 
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Toutes les catégories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="">Toutes les catégories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <InputLabel 
                            type="number"
                            label="Quantité *"
                            placeholder="0"
                            value={formData.quantite}
                            onChange={(e) => setFormData({...formData, quantite: e.target.value})}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix d'achat (FC) *"
                            placeholder="0"
                            value={formData.prixAchat}
                            onChange={(e) => setFormData({...formData, prixAchat: e.target.value})}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix de vente (FC) *"
                            placeholder="0"
                            value={formData.prixVente}
                            onChange={(e) => setFormData({...formData, prixVente: e.target.value})}
                        />
                        <InputLabel 
                            type="date"
                            label="Date d'expiration *"
                            value={formData.dateExpiration}
                            onChange={(e) => setFormData({...formData, dateExpiration: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton className="flex-1" outline onClick={() => setEditModal(false)}>
                            Annuler
                        </Bouton>
                        <Bouton primary className="flex-1" onClick={handleEditProduct}>
                            Sauvegarder les modifications
                        </Bouton>
                    </div>
                </div>
            </Modal>

            {/* Modal Vue */}
            <Modal open={viewModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-full max-w-lg p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Détails du produit</h2>
                    {selectedProduct && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                                <p className="text-gray-900 font-medium">{selectedProduct.nom}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <p className="text-gray-900">{selectedProduct.categorie}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en stock</label>
                                    <p className="text-gray-900 font-medium">{selectedProduct.quantite}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat</label>
                                    <p className="text-gray-900 font-medium">{selectedProduct.prixAchat} FC</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente</label>
                                    <p className="text-emerald-600 font-medium">{selectedProduct.prixVente} FC</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                                <p className="text-gray-900">{selectedProduct.dateExpiration}</p>
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
        </div>
    )
}
