import { Bouton } from "../../components/ui/bouton/index";
import { Download, CheckCircle,XCircle,Printer, Eye } from "lucide-react";
import { useState } from "react";
import Modal from "@mui/material/Modal"

export default function Historique() {

    const [open, setOpen] = useState(false)

    return (<>
        <div className="flex-1 p-3">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Historique des ventes du jour</h3>
                <div className="flex gap-2">
                    {/* <Bouton outline>
                        <Download className="w-4 h-4" />
                        Exporter
                    </Bouton> */}
                </div>
            </div>
            
            {/* Tableau des ventes */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">N°</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Heure</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Articles</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">001</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">12:30</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-medium text-gray-900">000 FC</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-600">00 articles</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full flex items-center inline-block text-xs font-medium ${
                                            'bg-blue-100 text-blue-700'
                                            // 'bg-red-100 text-red-700'
                                        }`}>
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span>Validée</span>
                                                </div>
                                                {/* <div className="flex items-center gap-1">
                                                    <XCircle className="w-3 h-3" />
                                                    <span>Annulée</span>
                                                </div> */}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                <Printer className="w-4 h-4 text-gray-600" />
                                            </button>
                                                <button 
                                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                                    title="Annuler la vente"
                                                >
                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                </button>
                                            <button  
                                                onClick={() => setOpen(true)}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                    Affichage de 1 à 8 sur 12 ventes
                </div>
                <div className="flex items-center gap-1">
                    <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
                        Précédent
                    </button>
                    <button className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-sm">
                        1
                    </button>
                    <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                        2
                    </button>
                    <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                        Suivant
                    </button>
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
                            <p>Facture #621223</p>
                            <p>9/01/2026 22:37</p>
                        </div>
                    </div>
                    <div className="py-2">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">nom X 12</p>
                            <p className="font-semibold ">12 Fc</p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-400/50 my-2" />
                    <div className="flex justify-between items-center text-xl font-bold">
                        <h2 className="">Total</h2>
                        <p className="font-semibold text-green-600">12 Fc</p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <Bouton primary
                        className="w-full">
                        <Printer />
                        Imprimer
                    </Bouton>
                    <Bouton className="w-full" outline
                        onClick={() => setOpen(false)}>
                        Fermer
                    </Bouton>
                </div> 
            </div>
        </Modal>
    </>)
}