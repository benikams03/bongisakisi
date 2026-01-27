/* eslint-disable react-hooks/rules-of-hooks */
import Layout_caissier from "./layout"
import { Header } from "../../components/caissier/header"
import { Input } from "../../components/ui/input"
import { FiSearch } from "react-icons/fi";
import { Card } from "../../components/ui/card";
import { Bouton } from "../../components/ui/bouton"
import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import { LiaReceiptSolid } from "react-icons/lia";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdRemove } from "react-icons/io";
import { FiCheckCircle } from "react-icons/fi";
import Modal from "@mui/material/Modal"
import { GiPill } from "react-icons/gi";
import { FiPrinter } from "react-icons/fi";
import toast from "react-hot-toast";
import { useFormMoney } from "../../utils/useMoney";

export default function Caissier() {

    const [medeciments, setMedeciments] = useState([]);
    const [panier, setPanier] = useState([]);
    const [total, setTotal] = useState([]);
    const [change, setChange] = useState(true)
    const [stats, setStats] = useState([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await window.electron.getMedicaments();
                const date2 = await window.electron.getAchats();
                const data3 = await window.electron.panierTotal();
                const date4 = await window.electron.stats_day();
                setMedeciments(data);
                setPanier(date2);
                setTotal(data3);
                setStats(date4);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }  
        }
        fetchCategories();
    }, [change])

    // --------------------------------------------------------------------
    // ajoute au panier
    const add = async (name, benefice, prix) => {
        try {
            await window.electron.createAchat({
                nom: name,
                etat: 'attente',
                prix_total: prix,
                benefice: benefice,
                quantite: 1
            })
            toast.success('Ajout au panier réussi')
            setChange(!change)
        } catch (e) {
            toast.error(e.message)
        } 
    }
    // --------------------------------------------------------------------
    // retire du panier
    const remove = async (id) => {
        try {
            await window.electron.deleteAchat(id)
            setChange(!change)
            toast.success( 'Suppression réussi')
        } catch (e) {
            toast.error(e.message)
        } 
    }
    // -------------------------------------------------------------------------
    const panierAdd = async (nom,id) => {
        try {
            const res = await window.electron.panierAdd(nom, id)
            if (!res.success) alert('Stock insuffisant')
            setChange(!change)
        } catch (e) {
            toast.error(e.message)
        } 
    }
    const panierRemove = async (nom,id) => {
        try {
            const res = await window.electron.panierRemove(nom, id)
            if (!res.success) alert('Stock insuffisant')
            setChange(!change)
        } catch (e) {
            toast.error(e.message)
        } 
    }
    
    // --------------------------------------------------------------------
    const [open, setOpen] = useState(false)
    const [somme, setSomme] =useState(0)
    const [detail, setDetail] =useState([])
    const handleClose = () => {
        setOpen(false)
        setConfirm(false)
        setDetail([])
        setSomme(0)
    }
    const handleOpen = () => {
        setOpen(true)
        setDetail(panier)
        setSomme(total.total)
    }
    const [confirm, setConfirm] = useState(false)
    const handleConfirm = async () => {
        try {
            const res = await window.electron.confirm_all()
            setConfirm(res.success)
            setChange(!change)
            toast.success('Achat confirmé')
        } catch (e) {
            toast.error(e.message)  
        }
    }
    // --------------------------------------------------------------------
    const handlePrint = () => {
        const html = document.getElementById("print-area").innerHTML;
        window.electron.print(html);
        handleClose()
    };

    // --------------------------------------------------------------------
    const [recherche, setRecherche] = useState('')

    return(
    <Layout_caissier>
        <div className="flex items-start gap-3 h-full">
            <div className="w-full h-[83%]">
                <Header data={stats}/>

                <div class="w-full h-full py-6 px-4 rounded-lg shadow-xs border border-gray-400/50 bg-gray-50">
                    <div>
                        <h3 className="font-semibold text-xl mb-3">Liste des Medicaments</h3>
                        <Input icons={<FiSearch className="text-gray-500" />}
                            value={recherche}
                            onChange={ e => setRecherche(e.target.value) }
                            placeholder="Recheercher un medicament..."/>
                    </div>

                    <div className="mt-2 overflow-auto h-[85%]">

                        { medeciments.map((valeur, index) => {
                            const view = valeur.nom.toLowerCase().includes(recherche.toLowerCase())
                            return(
                                <Card key={index} 
                                    className={`
                                        ${ view ? 'block' : 'hidden' } 
                                        !bg-gray-100 mb-2 flex justify-between items-center px-3 py-1
                                        ${ valeur.quantite === 0 ? 'opacity-40' : '' }`
                                    }>
                                    <div className="py-1">
                                        <h3 className="text-lg font-semibold">{valeur.nom}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <p>{valeur.categorie_nom}</p>
                                            <div className="border border-l border-gray-500 h-4" />
                                            <p className={`
                                                ${valeur.quantite >= 30 ? '' : ( valeur.quantite >= 10 ? 'text-yellow-500' : 'text-red-500') }
                                                `}>stock : {valeur.quantite}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <h2 className="font-bold text-xl">{useFormMoney(valeur.prix_vente)} Fc</h2>
                                        { valeur.quantite !== 0 ? 
                                            (<Bouton
                                                onClick={ () => add(valeur.nom, (valeur.prix_vente - valeur.prix_achat), valeur.prix_vente) }                                            className="px-2">
                                                <IoMdAdd size={18} />
                                            </Bouton> ) : 
                                            (<Bouton>
                                                <IoMdAdd size={18} />
                                            </Bouton> ) 
                                        }
                                    </div>
                                </Card>
                            ) })}
                    </div>
                </div>
            </div>

            <div className="w-[40%] h-full">
                <div class="h-full rounded-lg shadow-xs border border-gray-400/50 bg-gray-50
                    flex flex-col justify-between">
                    <div className="flex items-center p-4 gap-2 text-xl font-bold">
                        <HiOutlineShoppingCart size={20} />
                        <span>Panier</span>
                        <span className="text-sm bg-gray-300 px-2 rounded">{panier.length}</span>
                    </div>
                    <div className="px-4 h-[70%] overflow-auto">
                        { panier.map((valeur, index) => (
                            <Card key={index} className="px-3 py-1 mb-2">
                                <div className="flex justify-between items-center font-semibold">
                                    <p className="text-gray-700">{valeur.nom}</p>
                                    <p>{useFormMoney(valeur.prix_total * valeur.quantite)} Fc</p>
                                </div>
                                <div className="flex justify-between items-center py-1 font-semibold">
                                    <div className="flex items-center justify-between gap-3">
                                        <button 
                                            onClick={()=> panierRemove(valeur.nom, valeur.idachat) }
                                            className="border border-gray-400 p-1 rounded cursor-pointer hover:bg-gray-200">
                                            <IoMdRemove size={14} />
                                        </button>
                                        <p>{valeur.quantite}</p>
                                        <button 
                                            onClick={() => panierAdd(valeur.nom, valeur.idachat)}
                                            className="border border-gray-400 p-1 rounded cursor-pointer hover:bg-gray-200">
                                            <IoMdAdd size={14} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => remove(valeur.idachat)}
                                        className="cursor-pointer">
                                        <RiDeleteBin5Line size={20} className="hover:text-red-600 text-red-500 duration-100" />
                                    </button>
                                </div>
                            </Card>
                        ))}

                    </div>

                    <div>
                        <div className="border-t border-gray-400/50" />
                        <div className="p-4">
                            <div className="text-sm flex justify-between items-center">
                                <p className="text-gray-600">Benefice estime</p>
                                <p className="font-semibold text-green-500">{useFormMoney(total.totalbenef)} Fc</p>
                            </div>
                            <div className="border-t border-gray-400/50 my-2" />
                            <div className="flex justify-between items-center text-xl font-bold">
                                <h2 className="">Total</h2>
                                <p className="font-semibold text-green-600">{useFormMoney(total.total)} Fc</p>
                            </div>

                            <Bouton className="w-full mt-3"
                                onClick={handleOpen}>
                                <LiaReceiptSolid size={24} />
                                Acheter
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
                    <div id="print-area" className="bg-white border border-gray-300 w-1/3 p-4 rounded-lg shadow animate-fadeIn">
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
                            <div className="py-2">
                                { detail.map((valeur, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <p className="text-gray-600">{valeur.nom} X {valeur.quantite}</p>
                                        <p className="font-semibold ">{useFormMoney(valeur.prix_total * valeur.quantite)} Fc</p>
                                    </div>
                                )) }
                            </div>
                            
                            <div className="border-t border-gray-400/50 my-2" />
                            <div className="flex justify-between items-center text-xl font-bold">
                                <h2 className="">Total</h2>
                                <p className="font-semibold text-green-600">{useFormMoney(somme)} Fc</p>
                            </div>
                        </Card>
                        
                        { !confirm ?(
                        <div className="mt-3 flex gap-2">
                            <Bouton className="w-full" outline
                                onClick={handleClose}>
                                Annuler
                            </Bouton>
                            <Bouton onClick={handleConfirm} className="w-full">
                                Confirmation
                            </Bouton>
                        </div>) : (
                        <div className="mt-3 flex flex-col gap-2">
                            <Bouton
                                onClick={handlePrint}
                                className="w-full">
                                <FiPrinter />
                                Imprimer
                            </Bouton>
                            <Bouton className="w-full" outline
                                onClick={handleClose}>
                                Fermer
                            </Bouton>
                        </div> ) }
                    </div>
                </Modal>
            </div>
        </div>
    </Layout_caissier>
    )
} 