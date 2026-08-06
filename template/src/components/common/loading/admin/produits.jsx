export default function ProduitsLoading() {
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

            {/* Filtres et recherche skeleton */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex gap-2">
                            <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-1/2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Cartes de statistiques skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div>
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau skeleton */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                                <tr key={index}>
                                    <td className="py-3 px-4">
                                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
