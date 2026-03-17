import { Download, Check, Loader } from 'lucide-react'
import { Bouton } from "../ui/bouton/index";

export default function Update({ after }) {
    
    return (<>
        <div className="w-full py-8 px-18">
            <h1 className="text-center font-bold text-2xl">Mise à jour</h1>

            {/* <div className="text-center py-8">
                <Loader className="w-8 h-8 text--500 animate-spin mx-auto mb-8" />
                <p className="text-gray-600">Vérification des mises à jour...</p>
            </div> */}


            <div>
                <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Version 2.1.0 disponible</p>
                    <p className="text-sm text-gray-600 mb-6">Nouvelles fonctionnalités et corrections de bugs</p>
                    
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Téléchargement...</span>
                                <span>12%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${12}%` }}
                                />
                            </div>
                        </div>
                </div>


                <div className="flex gap-3">
                    <Bouton outline
                        onClick={after}
                        className="w-full">
                        Plus tard
                    </Bouton>

                    <Bouton primary
                        className="w-full">
                        <Download className="w-4 h-4" />
                        Télécharger
                    </Bouton>
                </div>
            </div>

        </div>
    </>)
}