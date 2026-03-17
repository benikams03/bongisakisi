import { cn } from "../../../lib/cn"
import { LoaderCircle } from "lucide-react"

function Bouton({ className, delet , load ,outline,primary, children,...props }) {
    return (
        <button
            className={cn(
                'border rounded-lg bg-black text-white font-semibold p-2 text-sm',
                'flex items-center justify-center gap-2',
                'hover:scale-[1.02] transition-transform active:scale-95 hover:bg-gray-800',
                'cursor-pointer',
                ( load && 'bg-gray-600'),
                ( outline && '!bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-200' ),
                ( delet && '!bg-red-600 !text-white hover:!bg-red-700' ),
                ( primary && '!bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-200'),
                className
            )}
            disabled={load}
            {...props}
        >
            { load && (<LoaderCircle className="animate-spin" />) }
            {children}
        </button>
    )
}

export { Bouton }