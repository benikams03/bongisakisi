/* eslint-disable react-hooks/rules-of-hooks */
import { Card } from "../../components/ui/card"
import { FiPackage } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { PiXCircleBold } from "react-icons/pi";
import { FaRegCheckCircle } from "react-icons/fa";
import { Select } from "../../components/ui/select";
import { useState, useEffect } from "react";
import { useFormttedData } from "../../utils/useFormttedData";
import { useFormMoney } from "../../utils/useMoney"

export default function Stock() {

    const [medeciments, setMedeciments] = useState([]);
    const [countMedeciments, setCountMedeciments] = useState([]);
    const [totalsmedocs, setTotalsmedocs] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await window.electron.getMedicaments();
                const data2 = await window.electron.totalsmedocs();
                setTotalsmedocs(data2);
                setCountMedeciments(data.length);
                setMedeciments(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }  
        }
        fetchCategories();
    }, [])
    // -------------------------------------------------------------------------------------------
    const [filtre, setFiltre] = useState('')

    return(<>
    
    <h3 className="font-bold text-2xl">Gestion du Stock</h3>
    <p className="text-gray-700">Surveillez votre inventaire et les alertes</p>

    <div className="flex gap-4 pt-4">
        <Card className="p-4 w-full">
            <p className="text-gray-700">Total produits</p>
            <div className="flex items-center gap-1 mt-6">
                <FiPackage size={20} className="text-blue-600" />
                <h2 className="text-2xl font-bold">{countMedeciments}</h2>
            </div>
        </Card>
        
        <Card className="p-4 w-full">
            <p className="text-gray-700">Stock OK</p>
            <div className="flex items-center gap-1 mt-6">
                <FaRegCheckCircle size={20} className="text-green-600" />
                <h2 className="text-2xl font-bold text-green-600">{ medeciments.filter(valeur => valeur.statut === "Stock OK").length }</h2>
            </div>
        </Card>
        
        <Card className="p-4 w-full">
            <p className="text-gray-700">Stock faible</p>
            <div className="flex items-center gap-1 mt-6">
                <FiAlertTriangle size={20} className="text-yellow-500" />
                <h2 className="text-2xl font-bold text-yellow-500">{ medeciments.filter(valeur => valeur.statut === "Stock faible").length }</h2>
            </div>
        </Card>

        <Card className="p-4 w-full">
            <p className="text-gray-700">Stock critique</p>
            <div className="flex items-center gap-1 mt-6">
                <PiXCircleBold size={20} className="text-red-600" />
                <h2 className="text-2xl font-bold">{ medeciments.filter(valeur => valeur.statut === "Stock critique").length }</h2>
            </div>
        </Card>

        <Card className="p-4 w-full">
            <p className="text-gray-700">Expire bientôt</p>
            <div className="flex items-center gap-1 mt-6">
                <FiAlertTriangle size={20} className="text-red-600" />
                <h2 className="text-2xl font-bold text-red-600">{ medeciments.filter(valeur => valeur.statut === "Expire bientôt").length }</h2>
            </div>
            <p className="text-sm font-semibold text-red-600">{ medeciments.filter(valeur => valeur.statut === "Expiré").length } déjà expiré</p>
        </Card>
        
    </div>

    <div className="flex gap-4 py-4">
        <Card className="p-4 w-full">
            <p className="text-gray-700">Valeur du stock (prix d'achat)</p>
            <div className="my-5">
                <h2 className="text-2xl font-bold">{useFormMoney(totalsmedocs.totalAchat)} Fc</h2>
            </div>
        </Card>
        
        <Card className="p-4 w-full">
            <p className="text-gray-700">Valeur du stock (prix de vente)</p>
            <div className="flex flex-col mt-6 text-green-600">
                <h3 className="text-2xl font-bold">{useFormMoney(totalsmedocs.totalVente)} Fc</h3>
                <h2 className="text-sm font-semibold">Marge potentielle: {useFormMoney(totalsmedocs.totalVente - totalsmedocs.totalAchat)} Fc</h2>
            </div>
        </Card>
    </div>

    <Card className="">
        <div className="flex justify-between items-center p-4">
            <div>
                <h3 className="font-semibold">Inventaire</h3>
                <p className="text-sm text-gray-700">{countMedeciments} produit(s) affiché(s)</p>
            </div>

            <div>
                <Select className="bg-gray-100"
                    value={filtre}
                    onChange={ e => setFiltre(e.target.value) }>
                    <option value="">Tout les produits</option>
                    <option value="Stock OK">Stock OK</option>
                    <option value="Stock faible">Stock faible</option>
                    <option value="Stock critique">Stock critique</option>
                    <option value="Expire bientôt">Expire bientôt</option>
                    <option value="Expiré">Expiré</option>
                </Select>
            </div>
        </div>

        <table className="w-full">
            <tr className="text-gray-500 border-b border-gray-300 text-sm">
                <th className="text-start p-2 font-semibold ">Nom</th>
                <th className="text-start p-2 font-semibold ">Catégorie</th>
                <th className="text-end p-2 font-semibold ">Quantité</th>
                <th className="text-start p-2 font-semibold ">Date d'expiration</th>
                <th className="text-start p-2 font-semibold ">Statut</th>
            </tr>

            { medeciments.map((valeur, index) => {
                const view = (filtre === '' || valeur.statut === filtre);
                return(
                    <tr key={index} className={`${ view ? '' : 'hidden' } text-gray-500 border-b border-gray-300`}>
                        <td className="p-3 text-start text-gray-900 font-semibold">{valeur.nom}</td>
                        <td className="p-3 text-start">{valeur.categorie_nom}</td>
                        <td className="p-3 text-end text-gray-900 font-semibold">{valeur.quantite}</td>
                        <td className="p-3 text-start text-sm">{ useFormttedData(valeur.date_expiration)}</td>
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
                    </tr>
                )
            })}
        </table>

    </Card>

    </>)
}