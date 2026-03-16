import { cn } from "../../../lib/cn"

function Input({ className, icons ,type, helperText, error , ...props }) {
    return (<div className="relative">
        { icons && <div className="absolute top-3.5 left-3">{icons}</div>}
        <input
            type={type}
            data-slot="input"
            className={cn(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black',
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