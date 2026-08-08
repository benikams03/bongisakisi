export default function AdminDettesLoading() {
    return (
        <div className="flex-1 h-full flex gap-3">
            {/* First column - Customer list skeleton */}
            <div className="w-[30%] h-full flex flex-col">
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                    <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="space-y-2">
                        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-auto">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Second column - Commands list skeleton */}
            <div className="w-[35%] h-full overflow-auto">
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                    <div className="mb-4">
                        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="flex-1 overflow-auto space-y-3">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Third column - Medications details skeleton */}
            <div className="flex-1 h-full overflow-auto">
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                    <div className="mb-4">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="space-y-3">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                            <div>
                                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                                                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
