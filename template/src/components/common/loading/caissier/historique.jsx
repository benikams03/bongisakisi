export default function HistoriqueLoading() {
    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Titre skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Tableau skeleton */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* En-têtes du tableau skeleton */}
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="text-left py-3 px-4">
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            </tr>
                        </thead>
                        {/* Lignes du tableau skeleton */}
                        <tbody className="divide-y divide-gray-200">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                                <tr key={index}>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
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
