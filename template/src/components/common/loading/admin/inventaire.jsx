export default function InventaireLoading() {
    return (
        <div className="p-2.5 h-full overflow-auto">
            {/* Header skeleton */}
            <div className="mb-6">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Statistiques principales skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Nombre de médicaments */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Capital de vente */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Prix total d'achat */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            {/* Résumé skeleton */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-36 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
