import { useState } from 'react'
import { Tag, Plus, Edit, Trash2, Package, Lock, AlertCircle } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"

// Catégories par défaut (non supprimables)
const defaultCategories = [
    { id: 1, nom: 'Antibiotiques', description: 'Médicaments pour traiter les infections bactériennes', produitCount: 45, isDefault: true },
    { id: 2, nom: 'Antalgiques', description: 'Médicaments pour soulager la douleur', produitCount: 32, isDefault: true },
    { id: 3, nom: 'Anti-inflammatoires', description: 'Médicaments pour réduire l\'inflammation', produitCount: 28, isDefault: true },
    { id: 4, nom: 'Vitamines', description: 'Compléments alimentaires et vitamines', produitCount: 56, isDefault: true },
    { id: 5, nom: 'Corticoïdes', description: 'Médicaments à base de cortisone', produitCount: 15, isDefault: true },
    { id: 6, nom: 'Anti-ulcéreux', description: 'Médicaments pour traiter les ulcères', produitCount: 18, isDefault: true },
    { id: 7, nom: 'Bronchodilatateurs', description: 'Médicaments pour traiter l\'asthme et les problèmes respiratoires', produitCount: 22, isDefault: true }
]

// Catégories personnalisées (supprimables)
const customCategories = [
    { id: 8, nom: 'Dermatologie', description: 'Produits pour la peau et les cheveux', produitCount: 12, isDefault: false },
    { id: 9, nom: 'Diabète', description: 'Médicaments pour le traitement du diabète', produitCount: 8, isDefault: false }
]

export default function Categories() {
    const [categories, setCategories] = useState([...defaultCategories, ...customCategories])
    const [searchTerm, setSearchTerm] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [formData, setFormData] = useState({
        nom: '',
        description: ''
    })

    const filteredCategories = categories.filter(category =>
        category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddCategory = () => {
        const newCategory = {
            id: Math.max(...categories.map(c => c.id)) + 1,
            ...formData,
            produitCount: 0,
            isDefault: false
        }
        setCategories([...categories, newCategory])
        resetForm()
        setOpenModal(false)
    }

    const handleEditCategory = () => {
        const updatedCategories = categories.map(category =>
            category.id === selectedCategory.id
                ? { ...category, ...formData }
                : category
        )
        setCategories(updatedCategories)
        resetForm()
        setEditModal(false)
    }

    const handleDeleteCategory = (id) => {
        const category = categories.find(c => c.id === id)
        if (category.isDefault) {
            alert('Cette catégorie par défaut ne peut pas être supprimée.')
            return
        }
        
        if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.nom}" ?`)) {
            setCategories(categories.filter(category => category.id !== id))
        }
    }

    const openEditModal = (category) => {
        if (category.isDefault) {
            alert('Cette catégorie par défaut ne peut pas être modifiée.')
            return
        }
        
        setSelectedCategory(category)
        setFormData({
            nom: category.nom,
            description: category.description
        })
        setEditModal(true)
    }

    const resetForm = () => {
        setFormData({
            nom: '',
            description: ''
        })
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des catégories</h2>
                    <p className="text-sm text-gray-600 mt-1">Organisez vos produits par catégories</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                        <Tag className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{categories.length} catégories</span>
                    </div>
                    <Bouton 
                        onClick={() => {
                            resetForm()
                            setOpenModal(true)
                        }}
                        primary>
                        <Plus className="w-4 h-4" />
                        Nouvelle catégorie
                    </Bouton>
                </div>
            </div>

            {/* Catégories par défaut */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Catégories par défaut</h3>
                    <span className="text-sm text-gray-500">(Non modifiables)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {defaultCategories.map((category) => (
                        <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                            <div className="absolute top-2 right-2">
                                <Lock className="w-4 h-4 text-gray-400" title="Catégorie par défaut" />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-slate-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{category.nom}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Package className="w-3 h-3" />
                                            <span>{category.produitCount} produits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Catégories personnalisées */}
            {customCategories.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories personnalisées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCategories
                            .filter(cat => !cat.isDefault)
                            .map((category) => (
                            <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Tag className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{category.nom}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Package className="w-3 h-3" />
                                                    <span>{category.produitCount} produits</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => openEditModal(category)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="p-1 hover:bg-red-100 rounded transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message si aucune catégorie personnalisée */}
            {filteredCategories.filter(cat => !cat.isDefault).length === 0 && searchTerm === '' && (
                <div className="text-center flex flex-col justify-center items-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie personnalisée</h3>
                    <p className="text-gray-600 mb-4">Créez vos propres catégories pour organiser vos produits</p>
                    <Bouton 
                        onClick={() => {
                            resetForm()
                            setOpenModal(true)
                        }}
                        primary>
                        <Plus className="w-4 h-4" />
                        Créer une catégorie
                    </Bouton>
                </div>
            )}

            {/* ============================================================================= */}
            {/* Modal Ajout */}
            <Modal open={openModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Ajouter une nouvelle catégorie</h2>
                    <div className="space-y-4">
                        <InputLabel 
                            type="Nom"
                            label="Nom de la catégorie *"
                            placeholder="Ex: Dermatologie"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton className="flex-1" outline onClick={() => setOpenModal(false)}>
                            Annuler
                        </Bouton>
                        <Bouton primary className="flex-1" onClick={handleAddCategory}>
                            Ajouter la catégorie
                        </Bouton>
                    </div>
                </div>
            </Modal>

            {/* Modal Modification */}
            <Modal open={editModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Modifier la catégorie</h2>
                    <div className="space-y-4">
                        <InputLabel 
                            type="Nom"
                            label="Nom de la catégorie *"
                            placeholder="Ex: Dermatologie"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton className="flex-1" outline onClick={() => setEditModal(false)}>
                            Annuler
                        </Bouton>
                        <Bouton primary className="flex-1" onClick={handleEditCategory}>
                            Sauvegarder
                        </Bouton>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
