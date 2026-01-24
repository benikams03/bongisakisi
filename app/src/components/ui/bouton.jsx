import { cn } from "../../lib/utils"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Bouton({ className, delet , load ,outline,children,...props }) {
    return (
        <button
            className={cn(
                'border rounded-lg bg-black text-white font-semibold p-2 text-sm',
                'flex items-center justify-center gap-2',
                'hover:bg-gray-600 duration-100',
                'cursor-pointer',
                ( load && 'bg-gray-600'),
                ( outline && '!bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-200' ),
                ( delet && '!bg-red-600 !text-white hover:!bg-red-700' ),
                className
            )}
            disabled={load}
            {...props}
        >
            { load && (<AiOutlineLoading3Quarters className="animate-spin" />) }
            {children}
        </button>
    )
}

export { Bouton }