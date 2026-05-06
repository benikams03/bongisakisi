export default function TableauLoading({ icone, titre }) {
    const Icon = icone

    return (
        <div className="flex flex-col items-center justify-center h-2/4 space-y-4">
            {/* Icône de chargement animée */}
            <div className="relative">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-400 animate-pulse" />
                </div>
            </div>
            
            {/* Messages de chargement */}
            <div className="text-center space-y-2">
                <div className="animate-pulse">
                    <h3 className="text-lg font-semibold text-gray-600">
                        Chargement en cours...
                    </h3>
                </div>
                
                <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                        Chargement {titre}
                    </p>
                    <p className="text-sm text-gray-400">
                        Veuillez patienter pendant que nous récupérons vos données
                    </p>
                </div>
            </div>
            
            {/* Barre de progression animée */}
            {/* <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" 
                     style={{ width: '0%' }}>
                </div>
            </div> */}
        </div>
    )
}