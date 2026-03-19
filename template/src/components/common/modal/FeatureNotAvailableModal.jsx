import { AlertCircle, X } from 'lucide-react'
import { Bouton } from '../../ui/bouton'
import Modal from "@mui/material/Modal"

export default function FeatureNotAvailableModal({ isOpen, onClose, featureName = "cette fonctionnalité" }) {
    return (
        <Modal open={isOpen} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
            <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Fonctionnalité non disponible</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-orange-800 text-sm">
                            {featureName} n'est pas encore disponible. Cette fonctionnalité sera disponible lors de la prochaine mise à jour du logiciel.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 mt-6">
                    <Bouton primary className="flex-1" onClick={onClose}>
                        Compris
                    </Bouton>
                </div>
            </div>
        </Modal>
    )
}
