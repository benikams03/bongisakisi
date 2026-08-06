export default function CategoriesLoading() {
    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>

            {/* Catégories par défaut skeleton */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                            <div className="absolute top-2 right-2">
                                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Catégories personnalisées skeleton */}
            <div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
