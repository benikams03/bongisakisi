import { cn } from "../../../lib/cn"
import { useState, useContext } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ThemeContext } from "../../../router/provider";

function Password({ className, icons ,helperText, error , ...props }) {

    const [showPassword, setShowPassword] = useState(false);
    const { color } = useContext(ThemeContext)

    return (<div className="relative">
        { icons && <div className="absolute top-3.5 left-3">{icons}</div>}
        <input
            type={showPassword ? "text" : "password"} 
            data-slot="input"
            className={cn(
                `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ` + color?.focus[500],
                ( error ? '!border-red-500 focus:!ring-red-500 focus:!ring-1' : null),
                ( icons ? 'pl-10' : null ),
                className
            )}
            {...props}
        />
        <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors ${props.except ? 'hidden' : ''}`}
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <p className="text-xs pl-2 text-red-500">{helperText}</p>
    </div>)
}

export { Password }