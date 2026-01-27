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

export default function Medicaments() {

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
            <h3 className="font-bold text-2xl">Gestion des Medicaments</h3>
            <p className="text-gray-700">10 medicaments au catalogue</p>
        </div>
        <div className="flex gap-2">
            <Link to="/admin/categorie"><Bouton className="px-4" outline>
                Mes categories</Bouton></Link>
            <Bouton onClick={handleOpenA}>
                <MdAdd size={18} />
                Ajouter un médicament</Bouton>
        </div>
    </div>

    <div className="flex items-center gap-3 pb-5 w-full">
        <div className="w-full">
            <Input icons={<FiSearch className="text-gray-500" />}
                className="w-full"
                placeholder="Recheercher un medicament..."/>
        </div>

        <Select className="bg-gray-100">
            <option value="">Toutes les categories</option>
            <option value="">Stock OK</option>
            <option value="">Stock faible</option>
            <option value="">Expire bientôt</option>
            <option value="">Expiré</option>
        </Select>
    </div>

    <Card className="pt-4">

        <table className="w-full">
            <tr className="text-gray-500 border-b border-gray-300 text-sm">
                <th className="text-start p-2 font-semibold ">Nom</th>
                <th className="text-start p-2 font-semibold ">Catégorie</th>
                <th className="text-start p-2 font-semibold ">Date d'expiration</th>
                <th className="text-end p-2 font-semibold ">Prix d'achat</th>
                <th className="text-end p-2 font-semibold ">Prix de vente</th>
                <th className="text-end p-2 font-semibold ">Quantité</th>
                <th className="text-start p-2 font-semibold ">Statut</th>
                <th className="text-end p-2 font-semibold ">Action</th>
            </tr>

            <tr className="text-gray-500 border-b border-gray-300">
                <td className="p-3 text-start text-gray-900 font-semibold">Doliprane 1000mg</td>
                <td className="p-3 text-start">Antalgique</td>
                <td className="p-3 text-start">31/12/2026</td>
                <td className="p-3 text-end font-semibold">150 Fc</td>
                <td className="p-3 text-end font-semibold text-green-500">150 Fc</td>
                <td className="p-3 text-end text-gray-900 font-semibold">150</td>
                <td className="p-3 text-start">
                    <div className="text-white text-center text-sm bg-yellow-500 rounded">
                        <span className="font-semibold ">Stock faible</span>
                    </div>
                </td>
                <td className="p-3 text-start">
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
            <h3 className="font-bold text-xl">Modifier un médicament</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Nom du medeciments</p>
                    <Input
                        type="text"
                    />
                </div>
                
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Catégorie</p>
                    <Select className="bg-gray-50 w-1/2">
                        <option value="">Toutes les categories</option>
                        <option value="">Stock OK</option>
                        <option value="">Stock faible</option>
                        <option value="">Expire bientôt</option>
                        <option value="">Expiré</option>
                    </Select>
                </div>

                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                    <Input
                        type="date"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                        <Input
                            type="number"
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                        <Input
                            type="number"
                        />
                    </div>
                </div>

                <div className="w-full ">
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Quantité en stock</p>
                    <Input
                        type="number"
                    />
                </div>
            </div>
            
            <div className="mt-3 flex justify-end gap-2 w-full">
                <Bouton className="px-6 w-full">
                    Mettre à jour
                </Bouton>
                <Bouton className="px-6 w-full" outline
                    onClick={handleCloseE}>
                    Fermer
                </Bouton>
            </div>
        </div>
    </Modal>
    <Modal 
        open={openA}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Ajouter un médicament</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Nom du medeciments</p>
                    <Input
                        type="text"
                    />
                </div>
                
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Catégorie</p>
                    <Select className="bg-gray-50 w-1/2">
                        <option value="">Toutes les categories</option>
                        <option value="">Stock OK</option>
                        <option value="">Stock faible</option>
                        <option value="">Expire bientôt</option>
                        <option value="">Expiré</option>
                    </Select>
                </div>

                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                    <Input
                        type="date"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                        <Input
                            type="number"
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                        <Input
                            type="number"
                        />
                    </div>
                </div>

                <div className="w-full ">
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Quantité en stock</p>
                    <Input
                        type="number"
                    />
                </div>
            </div>
            
            <div className="mt-3 flex justify-end gap-2 w-full">
                <Bouton className="px-6 w-full">
                    Ajouter
                </Bouton>
                <Bouton className="px-6 w-full" outline
                    onClick={handleCloseA}>
                    Fermer
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
            
            <p className="py-2 text-gray-600 text-sm">Etes-vous sur de vouloir supprimer le medicament "Doliprane 1000mg" ? Cette action est irreversible.</p>

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