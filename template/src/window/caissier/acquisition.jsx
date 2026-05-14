import { useState, useEffect, useContext } from 'react'
import { Package, Plus, ChevronDown, XCircle, User, Edit, File } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import { Select as SelectCustom } from '../../components/ui/input/select'
import Modal from "@mui/material/Modal"
import { useForm } from 'react-hook-form'
import { fournisseurService } from '../../services/admin/fourniseur_service'
import { famillieService } from '../../services/admin/famillie_service'
import { aquisitionService } from '../../services/admin/aquivistion_service'
import { ThemeContext } from '../../router/provider'


export default function Acquisition() {

    const { color } = useContext(ThemeContext)

    const [fournisseurs, setFournisseurs] = useState([])
    const [families, setFamilies] = useState([])
    const [load, setLoad] = useState(false)

    const [openM, setOpenM] = useState(false)

    // ============================================================================
    useEffect(() => {
        (async () => {
            const response = await fournisseurService.get()
            setFournisseurs(response)
            const data = await famillieService.get()
            setFamilies(data)
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
    const [editSupplierModal, setEditSupplierModal] = useState(false)
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

    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [openC, setOpenC] = useState(false)
    
    const {
        register: registerAddCommande,
        handleSubmit: handleSubmitAddCommande,
        formState: { errors: errorsAddCommande },
        reset: resetAddCommande
    } = useForm()

    const handleAddCommande = async (data) => {
        const success = await aquisitionService.add({
            id_fournisseur: selectedSupplier,
            id_family: data.family,
            name_medoc: data.name
        })
        if(success) { 
            setLoad(!load)
            resetAddCommande()
            setOpenC(false)
        }
    }



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
                    <span className="text-sm font-medium text-gray-700">{fournisseurs?.length} fournisseurs</span>
                </div>
                <Bouton 
                    onClick={() => setOpenM(true)}
                    primary>
                    <Plus className="w-4 h-4" />
                    Nouveau papier
                </Bouton>
            </div>
        </div>

        <div className="space-y-2">
            {fournisseurs?.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded-xl overflow-hidden transition-shadow">
                    {/* Header fournisseur */}
                    <div 
                        onClick={() => setSelectedSupplier(selectedSupplier === item.id ? null : item.id)}
                        className={"p-3 border-b border-gray-200 cursor-pointer transition-colors " + color?.bg.hover[55]}>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + color?.bg[200] }>
                                    <File className={"w-4 h-4 " + color?.text[700]} />
                                </div>
                                <div>
                                    <h2 className='text-xs'>Papier {index + 1}</h2>
                                    <h3 className="text-sm text-gray-900">
                                        Titre:
                                        <span className='font-semibold'> {item.name}</span>
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{item.data.length} produits</span>
                                <div className="flex items-center gap-1">
                                    <Bouton 
                                        outline 
                                        className="text-sm p-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditSupplier(item)
                                        }}
                                        title="Modifier le titre du papier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Bouton>
                                </div>
                                <div className={`transform transition-transform duration-200 ${selectedSupplier === item.id ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Détails déroulants */}
                    {selectedSupplier === item.id && (
                        <div className="border-t border-gray-100">

                            {/* Produits disponibles */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-gray-900">Produits ({item.data.length})</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                                    {item.data.map((value, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-medium text-gray-900 text-sm">{value.name_medoc}</h5>
                                                <button 
                                                    onClick={async() => {
                                                        await aquisitionService.delete(value.id);
                                                        setLoad(!load);
                                                    }}
                                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                                    title="Annuler la vente">
                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-600">
                                                <span>{families?.data?.find(f => f.id === value.id_family)?.name}</span>
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

            {fournisseurs.length === 0 && (
                <div className="text-center py-18">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Aucun fournisseur trouvé</p>
                </div>
            )}
        </div>
    </div>

    {/* =========================================================== */}
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
                        required: 'Un titre est obligatoire',
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

    {/* MODAL ADD NEW COMMANDE */}
    <Modal 
        open={openC}
        // onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <form method='post' onSubmit={handleSubmitAddCommande(handleAddCommande)} id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
            <h2 className="text-xl font-semibold mb-5">Ajouter une nouvelle commande</h2>

            <div className='space-y-2'>
                <InputLabel label="Nom du médicament"
                    icons={Package} 
                    type="text" 
                    placeholder="Pacetamol"
                    {...registerAddCommande('name', {
                        required: 'Le nom du médicament est obligatoire',
                        minLength: {
                            value: 2,
                            message: 'Le nom du médicament doit contenir au moins 2 caractères'
                        }
                    })}
                    error={!!errorsAddCommande.name}
                    helperText={errorsAddCommande.name?.message}
                />

                <SelectCustom
                    {...registerAddCommande('family', { 
                        required: 'Veuillez choisir une catégorie'
                    })}
                    label="Catégorie *"
                    placeholder="Choisir une catégorie"
                    error={!!errorsAddCommande.family}
                    helperText={errorsAddCommande.family?.message}
                >
                    {families?.data?.map((category, index) => (
                        <option key={index} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </SelectCustom>
                    
                </div>
            
            <div className="flex gap-2 mt-6">
                <Bouton primary type="submit" 
                    className="w-full">
                    Confirmation
                </Bouton>
                <Bouton className="w-full" outline
                    onClick={() => setOpenC(false)}>
                    Annuler
                </Bouton>
            </div>
        </form>
    </Modal>

    {/* Modal pour modifier le fournisseur */}
    <Modal open={editSupplierModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
        <form method='post' onSubmit={handleSubmitUpdateFournisseur(handleUpdateFournisseur)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Modifier le fournisseur</h2>
            
            <InputLabel label="Titre du papier"
                icons={File} 
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

    </>);
}