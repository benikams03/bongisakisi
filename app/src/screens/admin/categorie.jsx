import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card"
import { Bouton } from "../../components/ui/bouton";
import { MdAdd } from "react-icons/md";
import { Input } from "../../components/ui/input";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import Modal from "@mui/material/Modal"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { capitalize } from "../../utils/string";

export default function Categorie() {

    const [categories, setCategories] = useState([]);
    const [change, setChange] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await window.electron.getCategories();
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }  
        }
        fetchCategories();
    }, [change])

    // -----------------------------------------------------------------------------------------
    const [openA, setOpenA] = useState(false)
    const handleCloseA = () => setOpenA(false)
    const handleOpenA = () => setOpenA(true)

    const [loadAdd, setLoadAdd] = useState(false)
    const { register : registerAdd, handleSubmit : handleSubmitAdd, formState: { errors : errorsAdd }, reset : resetAdd } = useForm()
    
    const add = async (data) => {
        try {
            setLoadAdd(true)
            resetAdd()
            handleCloseA()
            await window.electron.createCategorie(capitalize(data.nameAdd))
            setChange(!change)
            toast.success( 'Ajout réussi')
        } catch (e) {
            toast.error(e.message)
        } finally {
            setLoadAdd(false)
        }
    }
    // -------------------------------------------------------------------------------------------
    const [getIdUpdate, setIdUpdate] = useState(0)
    const [getNameUpdate, setNameUpdate] = useState('')
    const [openE, setOpenE] = useState(false)
    const handleCloseE = () => {
        resetUpdate()
        setOpenE(false)
    }
    const handleOpenE = (id, name) => {
        setIdUpdate(id)
        setNameUpdate(name)
        setValue('nameUpdate', name)
        setOpenE(true)
    }
    
    const { register : registerUpdate, handleSubmit : handleSubmitUpdate, formState: { errors : errorsUpdate }, reset : resetUpdate, setValue } = useForm({
        defaultValues: {
            nameUpdate : getNameUpdate
        }
    })
    
    const update = async (data) => {
        try {
            resetUpdate()
            handleCloseE()
            await window.electron.updateCategorie(getIdUpdate ,capitalize(data.nameUpdate))
            setChange(!change)
            toast.success( 'Modification réussi')
        } catch (e) {
            toast.error(e.message)
        } 
    }

    // --------------------------------------------------------------------------------------------
    const [getId, setGetId] = useState(0)
    const [getName, setName] = useState('')
    const [openD, setOpenD] = useState(false)
    const handleCloseD = () => setOpenD(false)
    const handleOpenD = (id, name) => {
        setGetId(id)
        setName(name)
        setOpenD(true)
    }
    
    const remove = async (id) => {
        try {
            await window.electron.deleteCategorie(id)
            handleCloseD()
            setChange(!change)
            toast.success( 'Suppression réussi')
        } catch (e) {
            toast.error(e.message)
        } 
    }
    // -----------------------------------------------------------------------------------------

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

            { categories.map((valeur,index) => ( <tr key={index} className="text-gray-500 border-b border-gray-300">
                <td className="p-3 text-start text-gray-900 font-semibold">{valeur.nom}</td>
                <td className="p-3 text-start font-semibold text-blue-500">150</td>
                <td className="p-3 text-end">
                    <div className="flex justify-end items-center gap-4">
                        <button onClick={ () => handleOpenD(valeur.idcategorie, valeur.nom)} className="cursor-pointer hover:text-red-400 text-red-500 duration-200">
                            <RiDeleteBinLine size={18} />
                        </button>
                        <button onClick={ () => handleOpenE(valeur.idcategorie, valeur.nom)} className="cursor-pointer hover:text-black duration-200">
                            <FiEdit size={18} />
                        </button>
                    </div>
                </td>
            </tr>)) }
        </table>

    </Card>


    {/* ============================================================================================== */}
    <Modal 
        open={openE}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <form method="post" onSubmit={handleSubmitUpdate(update)} className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Modifier une categorie</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Titre</p>
                    <Input
                        type="text"
                        {...registerUpdate('nameUpdate',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        defaultValues={getNameUpdate}
                        error={errorsUpdate.nameUpdate}
                        helperText={ errorsUpdate.nameUpdate ? errorsUpdate.nameUpdate.message : null}
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
        </form>
    </Modal>

    <Modal 
        open={openA}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <form method="post" onSubmit={handleSubmitAdd(add)} className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Ajouter une categorie</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Titre</p>
                    <Input
                        type="text"
                        {...registerAdd('nameAdd',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        error={errorsAdd.nameAdd}
                        helperText={ errorsAdd.nameAdd ? errorsAdd.nameAdd.message : null}
                    />
                </div>
            </div>
            
            <div className="mt-3 flex justify-end gap-2 w-full">
                <Bouton
                    load={loadAdd}
                    className="px-6 w-full">
                    Ajouter
                </Bouton>
                <Bouton className="px-6 w-full" outline
                    onClick={handleCloseA}>
                    Fermer
                </Bouton>
            </div>
        </form>
    </Modal>

    <Modal 
        open={openD}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <div className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Confirmer la suppression</h3>
            
            <p className="py-2 text-gray-600 text-sm">Etes-vous sur de vouloir supprimer la catiegorie "{getName}" ? Cette action est irreversible.</p>

            <div className="mt-3 flex justify-end gap-2">
                <Bouton className="px-6" outline
                    onClick={handleCloseD}>
                    Fermer
                </Bouton>
                <Bouton onClick={ () => remove(getId) } className="px-6" delet>
                    Supprimer
                </Bouton>
            </div>
        </div>
    </Modal>

    </>)
}