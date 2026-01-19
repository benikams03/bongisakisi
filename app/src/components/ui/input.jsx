import { cn } from "../../lib/utils"

function Input({ className, icons ,type, helperText, error , ...props }) {
    return (<div className="relative">
        { icons && <div className="absolute top-5 left-3">{icons}</div>}
        <input
            type={type}
            data-slot="input"
            className={cn(
                'border border-gray-300 rounded-sm py-1 px-3 w-full bg-gray-50 outline-none',
                'focus-visible:border-gray-300 focus-visible:ring-gray-300 focus-visible:ring-1',
                ( error ? '!border-red-500' : null),
                ( icons ? 'pl-10' : null ),
                className
            )}
            {...props}
        />
        <p className="text-xs pl-2 text-red-500">{helperText}</p>
    </div>)
}

export { Input }