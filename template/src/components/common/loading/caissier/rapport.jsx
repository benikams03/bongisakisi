export default function RapportLoading() {
    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Titre skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Grille de 3 cartes de statistiques */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[0, 1, 2].map((index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        {/* Label skeleton */}
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                        {/* Value skeleton */}
                        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                        {/* Change badge skeleton */}
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
            
            {/* Section Top 10 */}
            <div className="grid grid-cols-1 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {/* Titre section skeleton */}
                    <div className="h-6 w-56 bg-gray-200 rounded animate-pulse mb-4"></div>
                    
                    {/* Liste skeleton */}
                    <div className="space-y-3">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                            <div key={index} className="flex justify-between items-center border-b border-dashed border-gray-300 pb-3">
                                <div className="flex items-center gap-3">
                                    {/* Rank skeleton */}
                                    <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                                    {/* Name skeleton */}
                                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                {/* Quantité skeleton */}
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
