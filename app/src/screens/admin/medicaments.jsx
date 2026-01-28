/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
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
import { capitalize } from "../../utils/string";
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useFormttedData } from "../../utils/useFormttedData";
import { getDaysBeforeExpiration } from "../../utils/useDateRestant";

export default function Medicaments() {

    const [medeciments, setMedeciments] = useState([]);
    const [countMedeciments, setCountMedeciments] = useState([]);
    const [change, setChange] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await window.electron.getMedicaments();
                setCountMedeciments(data.length);
                setMedeciments(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }  
        }
        fetchCategories();
    }, [change])

    const [categories, setCategories] = useState([]);
    const [countCategories, setCountCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await window.electron.getCategories();
                setCountCategories(data.length);
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }  
        }
        fetchCategories();
    }, [])

    // ---------------------------------------------------------------------------------------------------------
    // ajoute un medicament
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
            await window.electron.createMedicament({
                nom : capitalize(data.nameAdd), 
                categorieid : data.categorieAdd, 
                date_expiration : data.dateAdd, 
                prix_achat : data.prixAchatAdd, 
                prix_vente : data.prixVenteAdd, 
                quantite : data.quantiteAdd, 
                statut : data.quantiteAdd >= 30 ? 'Stock OK' : data.quantiteAdd >= 10 ? 'Stock faible' : 'Stock critique'
            })
            setChange(!change)
            toast.success( 'Ajout réussi')
        } catch (e) {
            toast.error(e.message)
        } finally {
            setLoadAdd(false)
        }
    }
    // ---------------------------------------------------------------------------------------------------------
    // supprime un medicament
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
            await window.electron.deleteMedicament(id)
            handleCloseD()
            setChange(!change)
            toast.success( 'Suppression réussi')
        } catch (e) {
            toast.error(e.message)
        } 
    }
    // ---------------------------------------------------------------------------------------------------------
    // modification de medicament
    const [getIdUpdate, setIdUpdate] = useState(0)
    const [getNameUpdate, setNameUpdate] = useState({})
    const [openE, setOpenE] = useState(false)
    const handleCloseE = () => {
        resetUpdate()
        setOpenE(false)
    }
    const handleOpenE = (id, name) => {
        setIdUpdate(id)
        setNameUpdate(name)
        setValue('nameUpdate', name.nom)
        setValue('categorieUpdate', name.categorieid)
        setValue('dateUpdate', name.date_expiration)
        setValue('prixAchatUpdate', name.prix_achat)
        setValue('prixVenteUpdate', name.prix_vente)
        setValue('quantiteUpdate', name.quantite)
        setOpenE(true)
    }
    
    const { register : registerUpdate, handleSubmit : handleSubmitUpdate, formState: { errors : errorsUpdate }, reset : resetUpdate, setValue } = useForm({
        defaultValues: {
            nameUpdate : getNameUpdate.nom,
            categorieUpdate : getNameUpdate.categorieid,
            dateUpdate : getNameUpdate.date_expiration,
            prixAchatUpdate : getNameUpdate.prix_achat,
            prixVenteUpdate : getNameUpdate.prix_vente,
            quantiteUpdate : getNameUpdate.quantite,
        }
    })
    
    const update = async (data) => {
        try {
            resetUpdate()
            handleCloseE()
            await window.electron.updateMedicament(getIdUpdate ,{
                nom : capitalize(data.nameUpdate), 
                categorieid : data.categorieUpdate, 
                date_expiration : data.dateUpdate, 
                prix_achat : data.prixAchatUpdate, 
                prix_vente : data.prixVenteUpdate, 
                quantite : data.quantiteUpdate, 
                statut : data.quantiteUpdate >= 30 ? 'Stock OK' : data.quantiteUpdate >= 10 ? 'Stock faible' : 'Stock critique'
            })
            // ----------------------------------------------------------
            // notiificaiton verifie si le stock es maintenant stable ou la date d'expiration
            if(data.quantiteUpdate >= 10) {
                await window.electron.updateNotification(getIdUpdate, 1)
            }
            // ----------------------------------------------------------
            setChange(!change)
            toast.success( 'Modification réussi')
        } catch (e) {
            toast.error(e.message)
        } 
    }
    // ---------------------------------------------------------------------------------------------------------
    const [recherche, setRecherche] = useState('')
    const [filtre, setFiltre] = useState('')

    return(<>
    
    <div className="pb-6 flex justify-between items-end">
        <div>
            <h3 className="font-bold text-2xl">Gestion des Medicaments</h3>
            <p className="text-gray-700">{countMedeciments} medicaments au catalogue</p>
        </div>
        <div className="flex gap-2">
            <Link to="/admin/categorie"><Bouton className="px-4" outline>
                Mes categories
                <span className="bg-blue-200 text-xs px-2 rounded">{countCategories}</span>
                </Bouton></Link>
            <Bouton onClick={handleOpenA}>
                <MdAdd size={18} />
                Ajouter un médicament</Bouton>
        </div>
    </div>

    <div className="flex items-center gap-3 pb-5 w-full">
        <div className="w-full">
            <Input icons={<FiSearch className="text-gray-500" />}
                type="search"
                value={recherche}
                onChange={ e => setRecherche(e.target.value) }
                className="w-full"
                placeholder="Recheercher un medicament..."/>
        </div>

        <Select className="bg-gray-100"
            value={filtre}
            onChange={ e => setFiltre(e.target.value) }>
            <option value="">Toutes les categories</option>
            { categories.map((valeur, index) => ( 
                <option key={index} value={valeur.idcategorie}>{valeur.nom}</option>
            )) }
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

            { medeciments.map((valeur, index) => {
                const view = valeur.nom.toLowerCase().includes(recherche.toLowerCase())
                    && (filtre === '' || valeur.categorieid.toString() === filtre);
                return(
                    <tr key={index} 
                        className={`
                            ${ view ? '' : 'hidden' } text-gray-500 border-b border-gray-300
                            ${ getDaysBeforeExpiration(valeur.date_expiration) === 0 ? 'bg-red-50' : '' }
                        `}>
                        <td className="p-3 text-start text-gray-900 font-semibold">{valeur.nom}</td>
                        <td className="p-3 text-start">{valeur.categorie_nom}</td>
                        <td className={`p-3 text-start text-xs ${getDaysBeforeExpiration(valeur.date_expiration) === 0 ? 'text-red-600 font-bold' : ( getDaysBeforeExpiration(valeur.date_expiration) <= 30 ? 'text-yellow-600 font-semibold' : '') }`}>
                            {   
                                getDaysBeforeExpiration(valeur.date_expiration) === 0 ? 'Expiré le ' + useFormttedData(valeur.date_expiration) :
                                "Expiration dans " + getDaysBeforeExpiration(valeur.date_expiration) + " jours"
                            }
                        </td>
                        <td className="p-3 text-end font-semibold">{valeur.prix_achat} Fc</td>
                        <td className="p-3 text-end font-semibold text-green-500">{valeur.prix_vente} Fc</td>
                        <td className="p-3 text-end text-gray-900 font-semibold">{valeur.quantite}</td>
                        <td className="p-3 text-start">
                            { valeur.quantite >= 30 ? (
                                <div className="text-green-500 bg-green-50 text-center text-xs border border-green-500 rounded">
                                    <span className="font-semibold ">{valeur.statut}</span>
                                </div>
                            ) : valeur.quantite >= 10 ? (
                                <div className="text-yellow-500 bg-yellow-50 text-center text-xs border border-yellow-500 rounded">
                                    <span className="font-semibold ">{valeur.statut}</span>
                                </div>
                            ) : (
                                <div className="text-red-500 bg-red-50 text-center text-xs border border-red-500 rounded">
                                    <span className="font-semibold ">{valeur.statut}</span>
                                </div>
                            )}
                        </td>
                        <td className="p-3 text-start">
                            <div className="flex justify-end items-center gap-4">
                                <button onClick={() => handleOpenE(valeur.idmed, valeur)} className="cursor-pointer hover:text-black duration-200">
                                    <FiEdit size={18} />
                                </button>
                                <button onClick={ () => handleOpenD(valeur.idmed, valeur.nom)} className="cursor-pointer hover:text-red-400 text-red-500 duration-200">
                                    <RiDeleteBinLine size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                )
            })}
        </table>

    </Card>


    {/* ============================================================================================== */}
    <Modal 
        open={openE}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
        <form method="post" onSubmit={handleSubmitUpdate(update)} className="bg-white border border-gray-300 w-2/5 p-4 rounded-lg shadow animate-fadeIn">
            <h3 className="font-bold text-xl">Modifier un médicament</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Nom du medeciments</p>
                    <Input
                        type="text"
                        {...registerUpdate('nameUpdate',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        error={errorsUpdate.nameUpdate}
                        helperText={ errorsUpdate.nameUpdate ? errorsUpdate.nameUpdate.message : null}
                    />
                </div>
                
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Catégorie</p>
                    <Select className="bg-gray-50 w-1/2"
                        {...registerUpdate('categorieUpdate',
                            { 
                                required:'Champ requis',
                            }
                        )}>
                        { categories.map((valeur, index) => ( 
                            <option key={index} value={valeur.idcategorie}>{valeur.nom}</option>
                        )) }
                    </Select>
                </div>

                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                    <Input
                        type="date"
                        {...registerUpdate('dateUpdate',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        error={errorsUpdate.dateUpdate}
                        helperText={ errorsUpdate.dateUpdate ? errorsUpdate.dateUpdate.message : null}
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Prix d'achat</p>
                        <Input
                            type="number"
                            {...registerUpdate('prixAchatUpdate',
                                { 
                                    required:'Champ requis',
                                }
                            )}
                            error={errorsUpdate.prixAchatUpdate}
                            helperText={ errorsUpdate.prixAchatUpdate ? errorsUpdate.prixAchatUpdate.message : null}
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Prix de vente</p>
                        <Input
                            type="number"
                            {...registerUpdate('prixVenteUpdate',
                                { 
                                    required:'Champ requis',
                                }
                            )}
                            error={errorsUpdate.prixVenteUpdate}
                            helperText={ errorsUpdate.prixVenteUpdate ? errorsUpdate.prixVenteUpdate.message : null}
                        />
                    </div>
                </div>

                <div className="w-full ">
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Quantité en stock</p>
                    <Input
                        type="number"
                        {...registerUpdate('quantiteUpdate',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        error={errorsUpdate.quantiteUpdate}
                        helperText={ errorsAdd.quantiteUpdate ? errorsUpdate.quantiteUpdate.message : null}
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
            <h3 className="font-bold text-xl">Ajouter un médicament</h3>
            
            <div className="py-4 grid gap-2">
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Nom du medeciments</p>
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
                
                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Catégorie</p>
                    <Select className="bg-gray-50 w-1/2"
                        {...registerAdd('categorieAdd',
                            { 
                                required:'Champ requis',
                            }
                        )}>
                        <option value={null}>Choisir la catégorie</option>
                        { categories.map((valeur, index) => ( 
                            <option key={index} value={valeur.idcategorie}>{valeur.nom}</option>
                        )) }
                    </Select>
                </div>

                <div>
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Date d'expiration</p>
                    <Input
                        type="date"
                        {...registerAdd('dateAdd',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        error={errorsAdd.dateAdd}
                        helperText={ errorsAdd.dateAdd ? errorsAdd.dateAdd.message : null}
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Prix d'achat</p>
                        <Input
                            type="number"
                            {...registerAdd('prixAchatAdd',
                                { 
                                    required:'Champ requis',
                                }
                            )}
                            error={errorsAdd.prixAchatAdd}
                            helperText={ errorsAdd.prixAchatAdd ? errorsAdd.prixAchatAdd.message : null}
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Prix de vente</p>
                        <Input
                            type="number"
                            {...registerAdd('prixVenteAdd',
                                { 
                                    required:'Champ requis',
                                }
                            )}
                            error={errorsAdd.prixVenteAdd}
                            helperText={ errorsAdd.prixVenteAdd ? errorsAdd.prixVenteAdd.message : null}
                        />
                    </div>
                </div>

                <div className="w-full ">
                    <p className="text-sm pb-1 pl-2 font-semibold text-gray-600">Quantité en stock</p>
                    <Input
                        type="number"
                        {...registerAdd('quantiteAdd',
                            { 
                                required:'Champ requis',
                            }
                        )}
                        error={errorsAdd.quantiteAdd}
                        helperText={ errorsAdd.quantiteAdd ? errorsAdd.quantiteAdd.message : null}
                    />
                </div>
            </div>
            
            <div className="mt-3 flex justify-end gap-2 w-full">
                <Bouton load={loadAdd} className="px-6 w-full">
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
            
            <p className="py-2 text-gray-600 text-sm">Etes-vous sur de vouloir supprimer le medicament "{getName}" ? Cette action est irreversible.</p>

            <div className="mt-3 flex justify-end gap-2">
                <Bouton className="px-6" outline
                    onClick={handleCloseD}>
                    Fermer
                </Bouton>
                <Bouton onClick={() => remove(getId)} className="px-6" delet>
                    Supprimer
                </Bouton>
            </div>
        </div>
    </Modal>

    </>)
}