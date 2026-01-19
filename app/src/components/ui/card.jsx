import { cn } from "../../lib/utils"

function Card({ className, ...props }) {
    return (
        <div
        data-slot="card"
        className={cn(
            'border border-gray-400/50 bg-gray-50 rounded-lg shadow-xs',
            className,
        )}
        {...props}
        />
    )
}


export {
    Card,
}
