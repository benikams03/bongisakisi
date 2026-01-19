import { Bouton } from "../ui/bouton"
import { Card } from "../ui/card";
import { LiaReceiptSolid } from "react-icons/lia";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import Modal from "@mui/material/Modal"
import { GiPill } from "react-icons/gi";
import { FiPrinter } from "react-icons/fi";

export function Facture() {

    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const handleOpen = () => setOpen(true)

    return(<>
    <div class="h-full rounded-lg shadow-xs border border-gray-400/50 bg-gray-50
        flex flex-col justify-between">
        <div className="flex items-center p-4 gap-2 text-xl font-bold">
            <HiOutlineShoppingCart size={20} />
            <span>Panier</span>
        </div>
        <div className="px-4 h-[70%] overflow-auto">
            <Card className="px-3 py-1 mb-2">
                <div className="flex justify-between items-center font-semibold">
                    <p className="text-gray-700">Name</p>
                    <p>34 Fc</p>
                </div>
                <div className="flex justify-between items-center py-1 font-semibold">
                    <div className="flex items-center justify-between gap-3">
                        <button className="border border-gray-400 p-1 rounded cursor-pointer hover:bg-gray-200">
                            <IoMdRemove size={14} />
                        </button>
                        <p>1</p>
                        <button className="border border-gray-400 p-1 rounded cursor-pointer hover:bg-gray-200">
                            <IoMdAdd size={14} />
                        </button>
                    </div>
                    <button className="cursor-pointer">
                        <RiDeleteBin5Line size={20} className="hover:text-gray-600 duration-100" />
                    </button>
                </div>
            </Card>

        </div>

        <div>
            <div className="border-t border-gray-400/50" />
            <div className="p-4">
                <div className="text-sm flex justify-between items-center">
                    <p className="text-gray-600">Sous-total</p>
                    <p className="font-semibold ">32 Fc</p>
                </div>
                <div className="text-sm flex justify-between items-center">
                    <p className="text-gray-600">Benefice estime</p>
                    <p className="font-semibold text-green-500">32 Fc</p>
                </div>
                <div className="border-t border-gray-400/50 my-2" />
                <div className="flex justify-between items-center text-xl font-bold">
                    <h2 className="">Total</h2>
                    <p className="font-semibold text-green-600">32 Fc</p>
                </div>

                <Bouton className="w-full mt-3"
                    onClick={handleOpen}>
                    <LiaReceiptSolid size={24} />
                    Confirmer l'achat
                </Bouton>
            </div>
        </div>
    </div>

    {/* =========================================================================================== */}
    <Modal 
        open={open}
        // onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
            <div className="flex justify-center flex-col items-center mb-6">
                <FiCheckCircle className="bg-gray-900 rounded-full p-2 text-gray-300" size={44} />
                <h3 className="font-bold text-lg">Vente effectuée</h3>
            </div>
            <Card className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-1">
                        <GiPill size={24} />
                        <div>
                            <h2 className="text-center font-bold text-lg ">
                                <span className="text-gray-400">BATELA</span>pharma
                            </h2>   
                        </div>
                    </div>
                    <div className="text-sm">
                        <p>Facture #621223</p>
                        <p>9/01/2026 22:37</p>
                    </div>
                </div>
                <div className="border-t border-gray-400/50 my-2" />
                <div className="flex justify-between items-center">
                    <p className="text-gray-600">Sous-total</p>
                    <p className="font-semibold ">32 Fc</p>
                </div>
                <div className="border-t border-gray-400/50 my-2" />
                <div className="flex justify-between items-center text-xl font-bold">
                    <h2 className="">Total</h2>
                    <p className="font-semibold text-green-600">32 Fc</p>
                </div>
            </Card>

            <div className="mt-3 flex gap-2">
                <Bouton className="w-full" outline
                    onClick={handleClose}>
                    Fermer
                </Bouton>
                <Bouton className="w-full">
                    <FiPrinter />
                    Imprimer
                </Bouton>
            </div>
        </div>
    </Modal>
    </>)
}