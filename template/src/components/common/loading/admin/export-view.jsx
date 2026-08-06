export default function ExportViewLoading() {
    return (
        <div className="p-2.5 h-full overflow-auto">
            {/* Header skeleton */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div>
                        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>

            {/* Statistiques skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-lg shadow-xs border border-gray-200 p-6 mb-4">
                {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="flex items-center gap-2 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="min-w-0 flex-1">
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtres skeleton */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-6">
                <div className="flex-1">
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>

            {/* Tableau skeleton */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="px-6 py-3">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="px-6 py-3">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="px-6 py-3">
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="px-6 py-3">
                                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="px-6 py-3">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
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
