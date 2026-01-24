import { cn } from "../../lib/utils"

function Select({ className ,children,...props }) {
    return(<>
    <select
        className={cn(
            'border border-gray-300 rounded-sm py-1 px-3',
            'focus-visible:border-gray-300 focus-visible:ring-gray-300 focus-visible:ring-1',
            className
        )}
        {...props}>
            {children}
        </select>
    </>)
}



export { Select }