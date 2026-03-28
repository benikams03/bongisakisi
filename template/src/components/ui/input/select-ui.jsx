import React, { useState, createContext, useContext, forwardRef } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';  

// 1. Création du Contexte pour l'état partagé
const SelectContext = createContext(null);

export function Select({ children, items, defaultValue = null }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  // On cherche le label correspondant à la valeur sélectionnée
  const selectedLabel = items?.find(i => i.value === selectedValue)?.label || items?.[0]?.label;

  return (
    <SelectContext.Provider value={{ open, setOpen, selectedValue, setSelectedValue, selectedLabel }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
}

// Composant SelectTrigger avec support de react-hook-form
export const SelectTrigger = forwardRef(({ ico, icons, children, ...props }, ref) => {
  const { open, setOpen, selectedValue } = useContext(SelectContext);
  const Icon = icons;
  
  // Gérer la valeur depuis react-hook-form si props.value existe
  const currentValue = props.value !== undefined ? props.value : selectedValue;
  
  return (
    <button
      type="button"
      ref={ref}
      onClick={() => setOpen(!open)}
      {...props}
      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <span className="mr-2">
        { ico && (<SlidersHorizontal size={19} className='text-gray-400'/>) }
        { icons && (<Icon size={19} className="text-gray-400" />) }
      </span>
      {children || currentValue}
      <span className="ml-2">
        <ChevronDown size={16} />
      </span>
    </button>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

export function SelectValue() {
  const { selectedLabel } = useContext(SelectContext);
  return <span className="block truncate">{selectedLabel}</span>;
}

export function SelectContent({ children }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;

  return (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
      {children}
    </div>
  );
}

export function SelectGroup({ children }) {
  return <div className="p-1">{children}</div>;
}

export function SelectItem({ children, value }) {
  const { setSelectedValue, setOpen, selectedValue } = useContext(SelectContext);
  
  const isSelected = selectedValue === value;

  return (
    <div
      onClick={() => {
        setSelectedValue(value);
        setOpen(false);
      }}
      className={`relative cursor-pointer select-none px-2 py-1.5 text-sm outline-none hover:bg-gray-200 rounded-sm ${
        isSelected ? "font-semibold bg-gray-100" : ""
      }`}
    >
      {children}
    </div>
  );
}