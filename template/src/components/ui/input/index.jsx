import { cn } from "../../../lib/cn"
import { useContext } from "react"
import { ThemeContext } from "../../../router/provider"

function Input({ className, icons ,type, helperText, error , ...props }) {

    const { color } = useContext(ThemeContext)

    return (<div className="relative">
        { icons && <div className="absolute top-2.5 left-3 text-gray-500">{icons}</div>}
        <input
            type={type}
            data-slot="input"
            className={cn(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ' + color?.focus[500],
                ( error ? '!border-red-500' : null),
                ( icons ? 'pl-10' : null ),
                className
            )}
            {...props}
        />
        <p className="text-xs pl-2 text-red-500">{helperText}</p>
    </div>)
}


function InputLabel({ className, icons ,type, helperText, error , label, ...props }) {
    const { color } = useContext(ThemeContext)
    const Icons = icons
    return (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">{label}</label>
        <div className="relative">
            { icons && <div className="absolute top-2.5 left-3">
                <Icons className="w-5 h-5 text-gray-400" />
            </div>}
            <input
                type={type}
                data-slot="input"
                className={cn(
                    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ' + color?.focus[500],
                    ( error ? '!border-red-500 focus:ring-red-500 focus:ring-1' : null),
                    ( icons ? 'pl-10' : null ),
                    className
                )}
                {...props}
            />
            <p className="text-xs pl-2 text-red-500">{helperText}</p>
        </div>
    </div>
    )
}



export { Input, InputLabel }