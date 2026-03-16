import { cn } from "../../../lib/cn"

function Select({ className ,children,...props }) {
    return(<>
    <select
        className={cn(
            'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black',
            className
        )}
        {...props}>
            {children}
        </select>
    </>)
}

export { Select }