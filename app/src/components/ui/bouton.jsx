import { cn } from "../../lib/utils"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Bouton({ className, load ,children,...props }) {
    return (
        <button
            className={cn(
                'border rounded-sm bg-black text-white font-semibold py-2 text-sm',
                'flex items-center justify-center gap-2',
                'hover:bg-gray-600 duration-100',
                'cursor-pointer',
                ( load && 'bg-gray-600'),
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