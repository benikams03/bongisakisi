import { useState, useEffect, useContext } from 'react'
import { File, ChevronDown,User, ChevronUp, Plus, CheckCircle, Package, Edit, Trash2 } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"
import { useForm } from 'react-hook-form'
import { fournisseurService } from '../../services/admin/fourniseur_service'
import { famillieService } from '../../services/admin/famillie_service'
import { produitService } from '../../services/admin/produit_service'
import ConfirmModal from '../../components/common/modal/confirme'
import { aquisitionService } from '../../services/admin/aquivistion_service'
import { ThemeContext } from "./../../router/provider"

export default function Approvisionnement() {

    const { color } = useContext(ThemeContext)
    const [fournisseurs, setFournisseurs] = useState([])
    const [familles, setFamilles] = useState([])
    const [load, setLoad] = useState(false)

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [cache, setCache] = useState()
    
    // ============================================================================
    useEffect(() => {
        (async () => {
            const response = await fournisseurService.get()
            setFournisseurs(response)
            const data = await famillieService.get()
            setFamilles(data)
        })()
    }, [load])
    // ============================================================================

    const {
        register: registerAddFournisseur,
        handleSubmit: handleSubmitAddFournisseur,
        formState: { errors: errorsAddFournisseur },
        reset: resetAddFournisseur
    } = useForm()

    const handleAddFournisseur = async (data) => {
        const success = await fournisseurService.add(data)
        if(success) { 
            setLoad(!load)
            resetAddFournisseur()
            setOpenM(false)
        }
    }
    // ============================================================================

    const [editFournisseur, setEditFournisseur] = useState(null)
    const {
        register: registerUpdateFournisseur,
        handleSubmit: handleSubmitUpdateFournisseur,
        formState: { errors: errorsUpdateFournisseur },
        reset: resetUpdateFournisseur
    } = useForm()

    const handleEditSupplier = (item) => {
        setEditSupplierModal(true)
        setEditFournisseur(item)
        resetUpdateFournisseur({
            name: item.name
        })
    }

    const handleUpdateFournisseur = async (data) => {
        const success = await fournisseurService.update({
            id: editFournisseur.id,
            name: data.name
        })
        if(success) { 
            setLoad(!load)
            setEditFournisseur(null)
            setEditSupplierModal(false)
        }
    }
    
    // ============================================================================
    // suppression
    const handleDeleteFournisseur = async (id) => {
        setCache(id)
        setShowConfirmModal(true)
    }
    // ============================================================================

    const [expandedSuppliers, setExpandedSuppliers] = useState([])
    const [openM, setOpenM] = useState(false)
    const [editSupplierModal, setEditSupplierModal] = useState(false)
    

    const toggleSupplier = (supplierId) => {
        setExpandedSuppliers(prev => 
            prev.includes(supplierId) 
                ? prev.filter(id => id !== supplierId)
                : [...prev, supplierId]
        )
    }

    // =========================================================
    
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [openModal, setOpenModal] = useState(false)

    const {
        register: registerAddProduit,
        handleSubmit: handleSubmitAddProduit,
        formState: { errors: errorsAddProduit },
        reset: resetAddProduit
    } = useForm()

    const handleAddProduit = async (data) => {
        const success = await produitService.add({
            name: selectedOrder.name_medoc,
            family: selectedOrder.id_family,
            quantite: data.quantite,
            prixAchat: data.prixAchat,
            prixVente: data.prixVente,
            dateExpiration: data.dateExpiration
        })

        await aquisitionService.validate(selectedOrder.id)

        if(success) { 
            setLoad(!load)
            resetAddProduit()
            setOpenModal(false)
        }
    }


    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Approvisionnement</h1>
                    <p className="text-gray-600">Gérez vos commandes fournisseurs</p>
                </div>
                <Bouton primary
                    onClick={() => setOpenM(true)}>
                    <Plus className="w-4 h-4" />
                    Nouveau papier
                </Bouton>
            </div>

            {/* Liste des fournisseurs */}
            <div className="space-y-4">
                {fournisseurs?.map((items, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg">
                        {/* En-tête du fournisseur */}
                        <div 
                            className={"px-3 py-2 flex items-center justify-between cursor-pointer " + color?.bg.hover[55] }
                            onClick={() => toggleSupplier(items.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + color?.bg[200] }>
                                    <File className={"w-4 h-4 " + color?.text[700]} />
                                </div>
                                <div>
                                    <h2 className='text-xs'>Papier {index + 1}</h2>
                                    <h3 className="text-sm text-gray-900">
                                        Titre:
                                        <span className='font-semibold'> {items.name}</span>
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                        {items.data?.length} commande{items.data?.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bouton 
                                        outline 
                                        className="text-sm p-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditSupplier(items)
                                        }}
                                        title="Modifier le fournisseur"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Bouton>
                                    <Bouton 
                                        outline 
                                        className="text-sm p-2 text-red-600 border-red-300 hover:bg-red-50"
                                        onClick={() => handleDeleteFournisseur(items.id)}
                                        title="Supprimer le fournisseur">
                                        <Trash2 className="w-4 h-4" />
                                    </Bouton>
                                </div>
                                {expandedSuppliers.includes(items.id) ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Commandes du fournisseur (déroulant) */}
                        {expandedSuppliers.includes(items.id) && (
                            <div className="border-t border-gray-200">
                                {items.data?.length > 0 ? (
                                    <div className="p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Commandes</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {items.data.map((value, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                                                            <Package className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{value.name_medoc}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Type de famille: {familles?.data?.find(f => f.id === value.id_family)?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Bouton 
                                                            primary 
                                                            className="text-sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSelectedOrder(value)
                                                                setOpenModal(true)
                                                            }}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Acheter
                                                        </Bouton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600">Aucune commande pour ce fournisseur</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {fournisseurs.length === 0 && (
                    <div className="text-center py-18">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Aucun fournisseur trouvé</p>
                    </div>
                )}
            </div>




            {/* Modal pour confirmer l'achat */}
            <Modal open={openModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitAddProduit(handleAddProduit)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Confirmer l'achat</h2>
                    
                    {selectedOrder && (
                        <div className="mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{selectedOrder.name_medoc}</p>
                                <p className="text-sm text-gray-600">Type de famille : {familles?.data?.find(f => f.id === selectedOrder.id_family)?.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <InputLabel 
                            type="number"
                            label="Quantité *"
                            placeholder="0"
                            {...registerAddProduit('quantite', {
                                required: 'La quantité est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'La quantité doit être positive'
                                }
                            })}
                            error={!!errorsAddProduit.quantite}
                            helperText={errorsAddProduit.quantite?.message}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix d'achat (FC) *"
                            placeholder="0"
                            {...registerAddProduit('prixAchat', {
                                required: 'Le prix d\'achat est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'Le prix doit être positif'
                                }
                            })}
                            error={!!errorsAddProduit.prixAchat}
                            helperText={errorsAddProduit.prixAchat?.message}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix de vente (FC) *"
                            placeholder="0"
                            {...registerAddProduit('prixVente', {
                                required: 'Le prix de vente est obligatoire',
                                min: {
                                    value: 0,
                                    message: 'Le prix doit être positif'
                                }
                            })}
                            error={!!errorsAddProduit.prixVente}
                            helperText={errorsAddProduit.prixVente?.message}
                        />
                        <InputLabel 
                            type="date"
                            label="Date d'expiration *"
                            {...registerAddProduit('dateExpiration', {
                                required: 'La date d\'expiration est obligatoire'
                            })}
                            error={!!errorsAddProduit.dateExpiration}
                            helperText={errorsAddProduit.dateExpiration?.message}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton primary className="flex-1" type="submit">
                            Confirmer l'achat
                        </Bouton>
                        <Bouton outline className="flex-1" onClick={() => setOpenModal(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>

            {/* MODAL ADD FOURNISSEUR */}
            <Modal 
                open={openM}
                // onClose={handleClose}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
                >
                <form method='post' onSubmit={handleSubmitAddFournisseur(handleAddFournisseur)} id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-5">Ajouter un papier</h2>

                    <div className='space-y-2'>
                        <InputLabel label="Titre du papier"
                            icons={File} 
                            type="text" 
                            placeholder=""
                            {...registerAddFournisseur('name', {
                                required: 'Le titre est obligatoire',
                                minLength: {
                                    value: 2,
                                    message: 'Le titre doit contenir au moins 2 caractères'
                                }
                            })}
                            error={!!errorsAddFournisseur.name}
                            helperText={errorsAddFournisseur.name?.message}
                            />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton primary type="submit"
                            className="w-full">
                            Confirmation
                        </Bouton>
                        <Bouton className="w-full" outline
                            onClick={() => setOpenM(false)}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>

            {/* Modal pour modifier le fournisseur */}
            <Modal open={editSupplierModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <form method='post' onSubmit={handleSubmitUpdateFournisseur(handleUpdateFournisseur)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Modifier le papier</h2>
                    
                    <InputLabel label="Titre du papier"
                        icons={User} 
                        type="text" 
                        {...registerUpdateFournisseur('name', {
                            required: 'Le titre est obligatoire',
                            minLength: {
                                value: 2,
                                message: 'Le titre doit contenir au moins 2 caractères'
                            }
                        })}
                        error={!!errorsUpdateFournisseur.name}
                        helperText={errorsUpdateFournisseur.name?.message}
                        />
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton primary className="flex-1" type="submit">
                            Mettre à jour
                        </Bouton>
                        <Bouton outline className="flex-1" onClick={() => {
                                setEditSupplierModal(false)
                                setEditFournisseur(null)
                            }}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </Modal>


            {/* modal de confirmation */}
            <ConfirmModal 
                open={showConfirmModal}
                onConfirm={async () => {
                    const success = await fournisseurService.delete(cache)
                    if(success) { 
                        setLoad(!load)
                    }
                    setShowConfirmModal(false);
                }}
                onCancel={() => setShowConfirmModal(false)}
                title="Supprimer le papier"
                message="Êtes-vous sûr de vouloir supprimer ce papier ? Toutes les commandes liées dans ce papier seront également supprimées"
            />
        </div>
    )
}
