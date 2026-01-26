import { cn } from "../../lib/utils"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

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

function CardLink( { to, icone, children } ) {

    const { pathname } = useLocation()

    return(<>
    <Link to={to} 
        className={`
            flex items-center gap-2 py-2 px-3 rounded-lg font-semibold text-gray-600
            hover:bg-gray-100 duration-200 hover:text-gray-900
            ${ pathname === to ? 'bg-gray-50 text-gray-900' : null  }
            ${ to === '/admin/' && pathname === '/admin' ? 'bg-gray-50 text-gray-900' : null }
        `}>
        {icone}
        {children}
    </Link>
    </>)
}


export {
    Card, CardLink,
}
