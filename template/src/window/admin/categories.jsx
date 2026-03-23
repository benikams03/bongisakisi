import { useState, useEffect } from 'react'
import { Tag, Plus, Edit, Trash2, Package, Lock, AlertCircle } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"
import { famillieService } from '../../services/admin/famillie'
import { useForm } from 'react-hook-form'


export default function Categories() {

    const [loading, setLoading] = useState(false)
    const [defaultCategorie, setDefaultCategorie] = useState([])
    const [customCategorie, setCustomCategorie] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const {
        register: registerAdd,
        handleSubmit: handleSubmitAdd,
        formState: { errors: errorsAdd },
        reset: resetAdd
    } = useForm({
        defaultValues: { name: '' }
    })
    
    const [editData, setEditData] = useState({
        id: 0,
        name :''
    })
    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: { errors: errorsUpdate },
        reset: resetUpdate
    } = useForm()

    
    useEffect(()=>{
        const res = async () => {
            setDefaultCategorie((await famillieService.getDefault()))
            setCustomCategorie((await famillieService.getCustom()))
        }
        res()
    },[loading])
    

    const handleAddCategory = async (data) => {
        const success = await famillieService.addCustom(data)
        if(success) { 
            resetAdd()
            setLoading(!loading)
            setOpenModal(false)
        }
    }

    const handleEditCategory = async(data) => {
        const success = await famillieService.updateCustom({
            id: editData.id,
            name: data.name
        })
        if(success) { 
            setLoading(!loading)
            setEditModal(false)
        }
    }

    const handleDeleteCategory = async (id) => {
        const success = await famillieService.deleteCustom({ id: id })
        if(success) { 
            setLoading(!loading)
        }
    }

    const openEditModal = (name, id) => {
        setEditData({
            id: id,
            name: name
        })
        // Réinitialiser le formulaire avec les nouvelles valeurs
        resetUpdate({ name: name })
        setEditModal(true)
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
                        <span className="text-sm font-medium text-gray-700">
                            {defaultCategorie?.data?.length + customCategorie?.data?.length || 0} catégories
                        </span>
                    </div>
                    <Bouton 
                        onClick={() => { setOpenModal(true) }}
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
                    {defaultCategorie?.data?.map((category, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                            <div className="absolute top-2 right-2">
                                <Lock className="w-4 h-4 text-gray-400" title="Catégorie par défaut" />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-slate-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Package className="w-3 h-3" />
                                            <span>{category.medicament_count} produits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Catégories personnalisées */}
            {customCategorie?.data?.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories personnalisées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customCategorie?.data?.map((category, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Tag className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{category.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Package className="w-3 h-3" />
                                                    <span>{category.medicament_count} produits</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => openEditModal(category.name, category.id)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                                            title="Modifier"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="p-1 hover:bg-red-100 rounded transition-colors cursor-pointer"
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
            {customCategorie?.data?.length === 0 && (
                <div className="text-center flex flex-col justify-center items-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie personnalisée</h3>
                    <p className="text-gray-600 mb-4">Créez vos propres catégories pour organiser vos produits</p>
                    <Bouton 
                        onClick={() => { setOpenModal(true) }}
                        primary>
                        <Plus className="w-4 h-4" />
                        Créer une catégorie
                    </Bouton>
                </div>
            )}

            {/* ============================================================================= */}
            {/* Modal Ajout */}
            <Modal open={openModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitAdd(handleAddCategory)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Ajouter une nouvelle catégorie</h2>
                    <div className="space-y-4">
                        <InputLabel 
                            type="Nom"
                            label="Nom de la catégorie *"
                            placeholder="Ex: Dermatologie"
                            {...registerAdd('name', {
                                required: 'Le nom de la catégorie est obligatoire',
                                minLength: {
                                    value: 2,
                                    message: 'Le nom de la catégorie doit contenir au moins 2 caractères'
                                }
                            })}
                            error={!!errorsAdd.name}
                            helperText={errorsAdd.name?.message}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton type="submit" primary className="flex-1">
                            Ajouter la catégorie
                        </Bouton>
                        <Bouton className="flex-1" outline onClick={() => setOpenModal(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>

            {/* Modal Modification */}
            <Modal open={editModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitUpdate(handleEditCategory)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-5">Modifier la catégorie</h2>
                    <div className="space-y-4">
                        <InputLabel 
                            type="Nom"
                            label="Nom de la catégorie *"
                            placeholder="Ex: Dermatologie"
                            {...registerUpdate('name', {
                                required: 'Le nom de la catégorie est obligatoire',
                                minLength: {
                                    value: 2,
                                    message: 'Le nom de la catégorie doit contenir au moins 2 caractères'
                                }
                            })}
                            error={!!errorsUpdate.name}
                            helperText={errorsUpdate.name?.message}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton type="submit" primary className="flex-1">
                            Sauvegarder
                        </Bouton>
                        <Bouton className="flex-1" outline onClick={() => setEditModal(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
