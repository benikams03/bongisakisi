import { useState } from 'react'
import { FileText, Eye, X } from 'lucide-react'
import { Bouton } from '../../../components/ui/bouton'
import Modal from "@mui/material/Modal"
import { StandardPDF } from '../../../data/models/pdf/standard'
import { StandardRecu } from '../../../data/models/recu/standard'

export const RenderImportSettings = () => {

    const [previewModalPDF, setPreviewModalPDF] = useState(false)
    const [modalSelect, setModalSelect] = useState([])

    const modelsPDF = [
        {
            id: 0,
            name: 'A4',
            description: 'Modèle Défaut',
            template: <StandardPDF />
        },
    ]
    
    
    const [previewModalRecu, setPreviewModalRecu] = useState(false)

    const modelsRecu = [
        {
            id: 0,
            name: '80mm',
            description: 'Modèle Défaut',
            template: <StandardRecu />
        },
    ]


    return (
        <div className="space-y-8">
            {/* Export PDF */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Export PDF
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="grid  grid-cols-3 gap-4">
                        {modelsPDF.map((model) => (
                            <div
                                key={model.id}
                                className={`relative cursor-pointer rounded-lg border-1 p-4 transition-all.5
                                        border-gray-200 bg-white hover:border-gray-300
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <p className="font-medium text-sm text-gray-900">{model.name}</p>
                                    </div>
                                    {/* <CheckCircle className="w-5 h-5 text-emerald-600" /> */}
                                </div>
                                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                                <div className="mt-3 flex gap-2">
                                    <Bouton
                                        onClick={() => {
                                            setModalSelect(model)
                                            setPreviewModalPDF(true)
                                        }}
                                        outline
                                        className="text-sm w-full"
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Aperçu
                                    </Bouton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Impression Reçus */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Impression de Reçus
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modelsRecu.map((model) => (
                            <div
                                key={model.id}
                                className={`relative cursor-pointer rounded-lg border-1 p-4 transition-all.5
                                        border-gray-200 bg-white hover:border-gray-300
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <p className="font-medium text-sm text-gray-900">{model.name}</p>
                                    </div>
                                    {/* <CheckCircle className="w-5 h-5 text-emerald-600" /> */}
                                </div>
                                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                                <div className="mt-3 flex gap-2">
                                    <Bouton
                                        onClick={() => {
                                            setModalSelect(model)
                                            setPreviewModalRecu(true)
                                        }}
                                        outline
                                        className="text-sm w-full"
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Aperçu
                                    </Bouton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* ---------------------------------------------------------------------------------------------------------- */}

            {/* Modal PDF */}
            <Modal open={previewModalPDF} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-1/2 rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <h2 className="font-light text-gray-900">
                            <span className='font-semibold'>Aperçu:</span> { modalSelect.name } | {modalSelect.description}
                        </h2>
                        <button
                            onClick={() => {
                                setPreviewModalPDF(false);
                                setModalSelect([])
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {modalSelect.template}
                    </div>
                </div>
            </Modal>
            
            
            {/* Modal TICKET THERMIQUE */}
            <Modal open={previewModalRecu} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                <div className="bg-white border border-gray-300 w-1/3 rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <h2 className="font-light text-gray-900">
                            <span className='font-semibold'>Aperçu:</span> { modalSelect.name } | {modalSelect.description}
                        </h2>
                        <button
                            onClick={() => {
                                setPreviewModalRecu(false);
                                setModalSelect([])
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {modalSelect.template}
                    </div>
                </div>
            </Modal>

        </div>
    )
}
