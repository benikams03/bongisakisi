export default function DettesLoading() {
    return (
        <div className="flex-1 h-full flex gap-3">
            {/* Left side - Customer list skeleton */}
            <div className="w-[30%] h-full flex flex-col">
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                    <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
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

            {/* Middle - Customer commands skeleton */}
            <div className="flex-1 h-full overflow-auto">
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                    <div className="mb-4">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="flex-1 overflow-auto space-y-3">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - Cart skeleton */}
            <div className="w-[32%] h-full sticky top-3 rounded-lg border border-gray-200 flex flex-col justify-between">
                <div className="p-4 flex items-center justify-between">
                    <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="p-2 h-full overflow-auto space-y-3">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="flex justify-between border border-gray-200 rounded-lg items-center py-2 px-4">
                            <div className="flex-1">
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 space-y-2 p-4 bg-white rounded-b-xl">
                    <div className="flex justify-between items-center py-2">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className='flex gap-2'>
                        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
