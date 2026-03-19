import { useState } from 'react'
import { Building2, ChevronDown,User, MapPin, ChevronUp, Plus, CheckCircle, Clock, AlertCircle, Package, Edit, Eye } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"

export default function Approvisionnement() {
    const [expandedSuppliers, setExpandedSuppliers] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [modalMode, setModalMode] = useState('purchase') // 'purchase' or 'edit'
    const [openM, setOpenM] = useState(false)
    
    // Données simulées pour les fournisseurs et leurs commandes
    const [suppliers, setSuppliers] = useState([
        {
            id: 1,
            nom: 'PharmaCentrale',
            email: 'contact@pharmacentrale.cd',
            telephone: '+243 812 345 678',
            adresse: 'Av. de la Paix, Kinshasa',
            statut: 'actif',
            commandes: [
                {
                    id: 1,
                    produit: 'Amoxicilline 1g',
                    quantite: 50,
                    prixUnitaire: 1200,
                    statut: 'en_attente',
                    dateCommande: '2024-03-15'
                },
                {
                    id: 2,
                    produit: 'Ibuprofène 400mg',
                    quantite: 100,
                    prixUnitaire: 350,
                    statut: 'en_attente',
                    dateCommande: '2024-03-15'
                }
            ]
        },
        {
            id: 2,
            nom: 'MediSupply',
            email: 'info@medisupply.cd',
            telephone: '+243 823 456 789',
            adresse: 'Boulevard du 30 Juin, Kinshasa',
            statut: 'actif',
            commandes: [
                {
                    id: 3,
                    produit: 'Paracétamol 500mg',
                    quantite: 200,
                    prixUnitaire: 150,
                    statut: 'en_attente',
                    dateCommande: '2024-03-14'
                }
            ]
        },
        {
            id: 3,
            nom: 'LaboPlus',
            email: 'service@laboplus.cd',
            telephone: '+243 834 567 890',
            adresse: 'Limbete, Kinshasa',
            statut: 'inactif',
            commandes: []
        }
    ])

    const [formData, setFormData] = useState({
        quantite: '',
        prixAchat: '',
        prixVente: ''
    })

    const toggleSupplier = (supplierId) => {
        setExpandedSuppliers(prev => 
            prev.includes(supplierId) 
                ? prev.filter(id => id !== supplierId)
                : [...prev, supplierId]
        )
    }

    const handlePurchase = (order) => {
        setSelectedOrder(order)
        setModalMode('purchase')
        setFormData({
            quantite: order.quantite,
            prixAchat: order.prixUnitaire,
            prixVente: ''
        })
        setOpenModal(true)
    }

    const handleConfirmPurchase = () => {
        // Mettre à jour le statut de la commande
        setSuppliers(prev => prev.map(supplier => ({
            ...supplier,
            commandes: supplier.commandes.map(commande => 
                commande.id === selectedOrder.id 
                    ? { ...commande, statut: 'achete', prixAchat: formData.prixAchat, prixVente: formData.prixVente }
                    : commande
            )
        })))
        
        setOpenModal(false)
        setSelectedOrder(null)
        setFormData({ quantite: '', prixAchat: '', prixVente: '' })
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
                    Ajouter un fournisseur
                </Bouton>
            </div>

            {/* Liste des fournisseurs */}
            <div className="space-y-4">
                {suppliers.map((supplier) => (
                    <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg">
                        {/* En-tête du fournisseur */}
                        <div 
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleSupplier(supplier.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{supplier.nom}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{supplier.email}</span>
                                        <span>{supplier.telephone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                        {supplier.commandes.length} commande{supplier.commandes.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                                {expandedSuppliers.includes(supplier.id) ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Commandes du fournisseur (déroulant) */}
                        {expandedSuppliers.includes(supplier.id) && (
                            <div className="border-t border-gray-200">
                                {supplier.commandes.length > 0 ? (
                                    <div className="p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Commandes</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {supplier.commandes.map((commande) => (
                                                <div key={commande.id} className="flex items-center justify-between p-3 border border-gray-200 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                                                            <Package className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{commande.produit}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Commandé le: {commande.dateCommande}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {commande.statut === 'en_attente' && (
                                                            <Bouton 
                                                                primary 
                                                                className="text-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handlePurchase(commande)
                                                                }}
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Acheter
                                                            </Bouton>
                                                        )}
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
            </div>

            {/* Modal pour confirmer l'achat */}
            <Modal open={openModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Confirmer l'achat</h2>
                    
                    {selectedOrder && (
                        <div className="mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{selectedOrder.produit}</p>
                                <p className="text-sm text-gray-600">Quantité demandée: {selectedOrder.quantite}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <InputLabel 
                            type="number"
                            label="Quantité achetée"
                            placeholder="Quantité"
                            value={formData.quantite}
                            onChange={(e) => setFormData({...formData, quantite: e.target.value})}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix d'achat unitaire (FC)"
                            placeholder="0"
                            value={formData.prixAchat}
                            onChange={(e) => setFormData({...formData, prixAchat: e.target.value})}
                        />
                        <InputLabel 
                            type="number"
                            label="Prix de vente unitaire (FC)"
                            placeholder="0"
                            value={formData.prixVente}
                            onChange={(e) => setFormData({...formData, prixVente: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                        <Bouton outline className="flex-1" onClick={() => setOpenModal(false)}>
                            Annuler
                        </Bouton>
                        <Bouton primary className="flex-1" onClick={handleConfirmPurchase}>
                            Confirmer l'achat
                        </Bouton>
                    </div>
                </div>
            </Modal>

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
        </div>
    )
}
