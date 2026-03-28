import { cn } from "../../../lib/cn"

export const Select = ({ label, placeholder, helperText, error,className,children,...props }) => {
    return(<>
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select 
            className={cn(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500',
                ( error ? '!border-red-500 focus:ring-red-500 focus:ring-1' : null),
                className
            )}
            {...props}
        >
            <option value="">{placeholder}</option>
            {children}
        </select>
        <p className="text-xs pl-2 text-red-500">{helperText}</p>
    </div>
    </>)
}