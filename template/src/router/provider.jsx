import { createContext, useEffect, useState } from "react";
import { themes } from "../constant/themes";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [color, setColor] = useState();
    const [load, setLoad] = useState(false)

    useEffect(() => {
        const savedColor = JSON.parse(localStorage.getItem('app-color')) || themes[0];
        setColor(savedColor);
    }, [load]);

    const changeColor = (newColor) => {
        localStorage.setItem('app-color', JSON.stringify(newColor));
        setColor(newColor);
        setLoad(!load)
    };
    
    return (
        <ThemeContext.Provider 
            value={{ 
                color, 
                changeColor 
            }}>
            {children}
        </ThemeContext.Provider>
    );
}