export default function RapportsLoading() {
    return (
        <div className="bg-white rounded-lg shadow-xs border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="divide-y divide-gray-200">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-5 w-56 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                                
                                {/* Statistiques skeleton */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="min-w-0 flex-1">
                                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton action skeleton */}
                            <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
