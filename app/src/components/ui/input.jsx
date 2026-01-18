import { cn } from "../../lib/utils"

function Input({ className, type, helperText, error , ...props }) {
    return (<div>
        <input
            type={type}
            data-slot="input"
            className={cn(
                'border border-gray-300 rounded-sm py-1 px-3 w-full bg-gray-50 outline-none',
                'focus-visible:border-gray-300 focus-visible:ring-gray-300 focus-visible:ring-1',
                ( error ? '!border-red-500' : null),
                className
            )}
            {...props}
        />
        <p className="text-xs pl-2 text-red-500">{helperText}</p>
    </div>)
}

export { Input }