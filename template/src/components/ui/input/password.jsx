import { cn } from "../../../lib/cn"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Password({ className, icons ,helperText, error , ...props }) {

    const [showPassword, setShowPassword] = useState(false);

    return (<div className="relative">
        { icons && <div className="absolute top-3.5 left-3">{icons}</div>}
        <input
            type={showPassword ? "text" : "password"} 
            data-slot="input"
            className={cn(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black',
                ( error ? '!border-red-500' : null),
                ( icons ? 'pl-10' : null ),
                className
            )}
            {...props}
        />
        <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <p className="text-xs pl-2 text-red-500">{helperText}</p>
    </div>)
}

export { Password }