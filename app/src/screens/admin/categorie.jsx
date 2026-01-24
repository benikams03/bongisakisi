import { useState } from "react";
import { Card } from "../../components/ui/card"
import { Select } from "../../components/ui/select";
import { Bouton } from "../../components/ui/bouton";
import { MdAdd } from "react-icons/md";
import { Input } from "../../components/ui/input";
import { FiSearch } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import Modal from "@mui/material/Modal"
import { Link } from "react-router-dom";

export default function Categorie() {

    const [openD, setOpenD] = useState(false)
    const handleCloseD = () => setOpenD(false)
    const handleOpenD = () => setOpenD(true)

    const [openE, setOpenE] = useState(false)
    const handleCloseE = () => setOpenE(false)
    const handleOpenE = () => setOpenE(true)

    const [openA, setOpenA] = useState(false)
    const handleCloseA = () => setOpenA(false)
    const handleOpenA = () => setOpenA(true)

    return(<>
    
    <div className="pb-6 flex justify-between items-end">
        <div>
            <h3 className="font-bold text-2xl">Mes catiegories</h3>
        </div>
        <div className="flex gap-2">
            <Bouton onClick={handleOpenA}>
                <MdAdd size={18} />
                Ajouter une categorie</Bouton>
        </div>
    </div>

    <Card className="pt-4">

        <table className="w-full">
            <tr className="text-gray-500 border-b border-gray-300 text-sm">
                <th className="text-start p-2 font-semibold ">Nom</th>
                <th className="text-start p-2 font-semibold ">Nombre des medicaments</th>
                <th className="text-end p-2 font-semibold ">Action</th>
            </tr>

            <tr className="text-gray-500 border-b border-gray-300">
                <td className="p-3 text-start text-gray-900 font-semibold">Doliprane 1000mg</td>
                <td className="p-3 text-start font-semibold text-blue-500">150</td>
                <td className="p-3 text-end">
                    <div className="flex justify-end items-center gap-4">
                        <button onClick={handleOpenE} className="cursor-pointer hover:text-black duration-200">
                            <FiEdit size={18} />
                        </button>
                        <button onClick={handleOpenD} className="cursor-pointer hover:text-black duration-200">
                            <RiDeleteBinLine size={18} />
                        </button>
                    </div>
                </td>
            </tr>
        </table>

    </Card>


    {/* ============================================================================================== */}
    <Modal 
        open={openE}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Modifier une categorie</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Titre</p>
                    <Input
                        type="text"
                    />
                </div>
            </div>
            
            <div className="mt-3 flex justify-end gap-2 w-full">
                <Bouton className="px-6 w-full" outline
                    onClick={handleCloseE}>
                    Fermer
                </Bouton>
                <Bouton className="px-6 w-full">
                    Mettre à jour
                </Bouton>
            </div>
        </div>
    </Modal>
    <Modal 
        open={openA}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Ajouter une categorie</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Titre</p>
                    <Input
                        type="text"
                    />
                </div>
            </div>
            
            <div className="mt-3 flex justify-end gap-2 w-full">
                <Bouton className="px-6 w-full" outline
                    onClick={handleCloseA}>
                    Fermer
                </Bouton>
                <Bouton className="px-6 w-full">
                    Ajouter
                </Bouton>
            </div>
        </div>
    </Modal>

    <Modal 
        open={openD}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Confirmer la suppression</h3>
            
            <p className="py-2 text-gray-600 text-sm">Etes-vous sur de vouloir supprimer la catiegorie "Doliprane 1000mg" ? Cette action est irreversible.</p>

            <div className="mt-3 flex justify-end gap-2">
                <Bouton className="px-6" outline
                    onClick={handleCloseD}>
                    Fermer
                </Bouton>
                <Bouton className="px-6" delet>
                    Supprimer
                </Bouton>
            </div>
        </div>
    </Modal>

    </>)
}