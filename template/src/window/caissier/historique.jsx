import { useState, useEffect } from "react";
import { Bouton } from "../../components/ui/bouton/index";
import { CheckCircle,XCircle,Printer, Eye } from "lucide-react";
import Modal from "@mui/material/Modal"
import { ordersService } from '../../services/caissier/orders_service'
import { formatTimeOnly, formatDateToDMYWithTime } from '../../hooks/format_date'
import { number } from "../../hooks/number";
import ConfirmModal from '../../components/common/modal/confirme'

export default function Historique() {

    const [open, setOpen] = useState(false)
    const [panierToday, setPanierToday] = useState([])
    const [viewOrder, setViewOrder] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [load, setLoad] = useState(false);
    const [cache, setCache] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await ordersService.getPanierToday()
            setPanierToday(data.data)
        })()
    }, [load])
    

    return (<>
        <div className="flex-1 p-2.5 h-full overflow-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Historique des ventes du jour</h3>
            </div>
            
            {/* Tableau des ventes */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Heure</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Articles</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            { panierToday?.map((panier, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{formatTimeOnly(panier.datecreate)}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-medium text-gray-900">{panier.totalPanier} FC</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-600">{panier.nombreMedicaments} articles</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        

                                        <span className={`px-2 py-1 rounded-full flex items-center inline-block text-xs font-medium 
                                        ${
                                            panier.medicaments[0].status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                                { panier.medicaments[0].status === 'confirmed' ? (
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        <span>Validée</span>
                                                    </div> ) : (
                                                    <div className="flex items-center gap-1">
                                                        <XCircle className="w-3 h-3" />
                                                        <span>Annulée</span>
                                                    </div>
                                                )}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                className="p-1 hover:bg-red-100 rounded transition-colors"
                                                title="Annuler la vente"
                                                onClick={()=>{
                                                    setCache(panier.panier);
                                                    setShowConfirmModal(true)
                                                }}
                                            >
                                                <XCircle className="w-4 h-4 text-red-600" />
                                            </button>
                                            <button  
                                                onClick={() => {
                                                    setViewOrder(panier?.medicaments)
                                                    setOpen(true)
                                                }}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>

        {/* ===================================================================== */}
        <Modal 
            open={open}
            // onClose={handleClose}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
            >
            <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
                <div className="p-4">
                    <div className="flex justify-center items-center">
                        <div className="text-sm">
                            {/* <p>Facture #621223</p> */}
                            <p>{formatDateToDMYWithTime(viewOrder?.[0]?.datecreate)}</p>
                        </div>
                    </div>
                    <div className="py-2">
                        { viewOrder?.map((items, index) => {
                            return (
                                <div key={index} className="flex justify-between items-center">
                                    <p className="text-gray-600">{items.name} <span className="text-xs text-gray-500">X {items.quantity}</span></p>
                                    <p className="font-semibold ">{number.format(items.price_total)} Fc</p>
                                </div>
                            )
                        })}
                    </div>
                    
                    <div className="border-t border-gray-400/50 my-2" />
                    <div className="flex justify-between items-center text-xl font-bold">
                        <h2 className="">Total</h2>
                        <p className="font-semibold text-green-600">{viewOrder?.reduce((sum, item) => sum + item.price_total, 0)} Fc</p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    {/* <Bouton primary
                        className="w-full">
                        <Printer />
                        Imprimer
                    </Bouton> */}
                    <Bouton className="w-full" outline
                        onClick={() => {
                            setOpen(false)
                            setViewOrder([])
                        }}>
                        Fermer
                    </Bouton>
                </div> 
            </div>
        </Modal>



        {/* modal de confirmation */}
        <ConfirmModal 
            open={showConfirmModal}
            onConfirm={async () => {
                const success = await ordersService.annulerCommande(cache)
                if(success) { 
                    setLoad(!load)
                }
                setShowConfirmModal(false);
            }}
            onCancel={() => setShowConfirmModal(false)}
            btn="Confirmer"
            title="Annuler la vente"
            message="Êtes-vous sûr de vouloir annuler cette vente ?"
        />
    </>)
}