import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [color, setColor] = useState('light');

    
    return (
        <ThemeContext.Provider 
            value={{ 
                color, 
                setColor 
            }}>
            {children}
        </ThemeContext.Provider>
    );
}