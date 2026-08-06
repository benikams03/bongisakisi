export default function IndexLoading() {
    return (
        <div className="flex-1 h-full flex gap-3">
            {/* Catalogue des médicaments */}
            <div className="flex-1 h-full overflow-auto">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-7 w-64 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Barre de recherche skeleton */}
                    <div className="space-y-4 flex items-center gap-2 mb-3">
                        <div className='w-full'>
                            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                    
                    {/* Grille de produits skeleton */}
                    <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-white to-gray-50">
                                {/* Header de la carte */}
                                <div className="flex justify-between items-start mb-1">
                                    <div className="w-9 h-9 border border-gray-200 rounded-lg bg-gray-200 animate-pulse"></div>
                                    <div className="space-y-1">
                                        <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                {/* Nom du médicament */}
                                <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                                {/* Famille */}
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                {/* Bouton */}
                                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
