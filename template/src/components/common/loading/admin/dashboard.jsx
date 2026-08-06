export default function DashboardLoading() {
    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                        <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Statistiques principales skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Top 10 produits skeleton */}
            <div className="grid grid-cols-1 gap-3 mb-5">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                            <div key={index} className="flex items-center border border-gray-200 justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-7 h-7 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div>
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stocks faibles et expirés skeleton */}
            <div className="grid grid-cols-2 gap-5">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
