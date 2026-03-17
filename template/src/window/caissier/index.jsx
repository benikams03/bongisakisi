import { useState } from 'react'
import { Package, Search, CreditCard, Pill, Plus, ShoppingCart, Minus, Trash2, CheckCircle, Printer  } from 'lucide-react'
import { Bouton } from './../../components/ui/bouton/index'
import { Input } from './../../components/ui/input/index'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from './../../components/ui/input/select-ui'
import Modal from "@mui/material/Modal"

const items = [
    { label: "Select a fruit", value: null },
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
]

export default function IndexCaisse() {

    const [open, setOpen] = useState(false)

    return(<>
    <div className="flex-1 h-full flex gap-3">
        {/* Produits */}
        <div className="flex-1 h-full overflow-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Catalogue des médicaments</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{12} produits</span>
                    </div>
                </div>

                <div className="mb-3 space-y-4 flex items-center gap-2">
                    <div className='w-full'>
                        <Input icons={<Search className="text-gray-400 w-5 h-5" />} 
                            placeholder="Rechercher un médicament, n° lot, ou catégorie..." 
                            className='w-full'/>
                    </div>
                    
                    <div className="mb-4 w-1/4">
                        <Select items={items} defaultValue={null}>
                            <SelectTrigger ico>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {items.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                

                {/* Grille de produits améliorée */}
                <div className="grid grid-cols-3 gap-4">
                        <div className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50">
                            <div className="flex justify-between items-start mb-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                                    <Pill className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        'bg-green-100 text-green-700' 
                                    }`}>
                                        Stock: 12
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-600">123 FC</span>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">test</h3>
                            <p className="text-xs text-gray-500 mb-2">category</p>
                            <Bouton primary
                                className='w-full group-hover:scale-105'>
                                <Plus className="w-4 h-4" />
                                Ajouter 
                            </Bouton>
                        </div>
                        
                </div>
            </div>
        </div>


        <div className="w-[35%] h-full sticky top-3 rounded-lg border border-gray-200 flex flex-col justify-between">
            <div className="p-4 flex items-center justify-between ">
                <h2 className="text-xl font-bold text-gray-900">Panier</h2>
                <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">12 articles</span>
                </div>
            </div>
            <div className="p-2 h-full overflow-auto space-y-3">
               
                {/* <div className="flex flex-col items-center justify-center h-full w-full px-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Le panier est vide</p>
                    <p className="text-sm text-gray-400 mt-1 mb-16">Ajoutez des médicaments pour commencer</p>
                </div> */}

                <div className="flex justify-between border border-gray-200 rounded-lg items-center py-2 px-4 hover:bg-gray-50 transition-all duration-200">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">hello</h4>
                        <div className="flex items-center text-xs gap-3 text-sm text-gray-600 mt-1">
                            <span>12 FC</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-medium">1</span>
                            <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <button 
                            className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
                
            </div>

            <div className="border-t border-gray-200 space-y-1 p-4 bg-white rounded-b-xl">
                <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-gray-500">Total</span>
                    <span className="text-2xl font-bold">12 FC</span>
                </div>
                <Bouton primary
                    className='w-full'
                    onClick={() => setOpen(true)}>
                    <CreditCard className="w-5 h-5" />
                    Valider la vente
                </Bouton>
            </div>
        </div>
    </div>

    {/* ================================================================================= */}
    <Modal 
        open={open}
        // onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
            <div className="flex justify-center flex-col items-center">
                <CheckCircle className="bg-emerald-600 rounded-full p-2 text-gray-300" size={44} />
                <h3 className="font-bold text-lg">Vente effectuée</h3>
            </div>
            <div className="p-4">
                <div className="flex justify-center items-center">
                    <div className="text-sm">
                        <p>Facture #621223</p>
                        <p>9/01/2026 22:37</p>
                    </div>
                </div>
                <div className="py-2">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">nom X 12</p>
                        <p className="font-semibold ">12 Fc</p>
                    </div>
                </div>
                
                <div className="border-t border-gray-400/50 my-2" />
                <div className="flex justify-between items-center text-xl font-bold">
                    <h2 className="">Total</h2>
                    <p className="font-semibold text-green-600">12 Fc</p>
                </div>
            </div>
            
            
            <div className="mt-3 flex gap-2">
                <Bouton className="w-full" outline
                    onClick={() => setOpen(false)}>
                    Annuler
                </Bouton>
                <Bouton primary
                    onClick={() => setOpen(false)} 
                    className="w-full">
                    Confirmation
                </Bouton>
            </div>
            <div className="mt-3 flex flex-col gap-2">
                <Bouton primary
                    className="w-full">
                    <Printer />
                    Imprimer
                </Bouton>
                <Bouton className="w-full" outline
                    onClick={() => setOpen(false)}>
                    Fermer
                </Bouton>
            </div> 
        </div>
    </Modal>
    </>)
}