import { Card } from "../../components/ui/card"
import { FiPackage } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { PiXCircleBold } from "react-icons/pi";
import { FaRegCheckCircle } from "react-icons/fa";
import { Select } from "../../components/ui/select";

export default function Stock() {
    return(<>
    
    <h3 className="font-bold text-2xl">Gestion du Stock</h3>
    <p className="text-gray-700">Surveillez votre inventaire et les alertes</p>

    <div className="flex items-center gap-4 pt-4">
        <Card className="p-4 w-full">
            <p className="text-gray-700">Total produits</p>
            <div className="flex items-center gap-1 mt-6">
                <FiPackage size={20} className="text-blue-600" />
                <h2 className="text-2xl font-bold">13</h2>
            </div>
        </Card>
        
        <Card className="p-4 w-full">
            <p className="text-gray-700">Stock OK</p>
            <div className="flex items-center gap-1 mt-6">
                <FaRegCheckCircle size={20} className="text-green-600" />
                <h2 className="text-2xl font-bold text-green-600">13</h2>
            </div>
        </Card>
        
        <Card className="p-4 w-full">
            <p className="text-gray-700">Stock faible</p>
            <div className="flex items-center gap-1 mt-6">
                <FiAlertTriangle size={20} className="text-yellow-500" />
                <h2 className="text-2xl font-bold text-yellow-500">13</h2>
            </div>
        </Card>

        <Card className="p-4 w-full">
            <p className="text-gray-700">Expire bientôt</p>
            <div className="flex items-center gap-1 mt-6">
                <FiAlertTriangle size={20} className="text-red-600" />
                <h2 className="text-2xl font-bold text-red-600">13</h2>
            </div>
        </Card>
        
        <Card className="p-4 w-full">
            <p className="text-gray-700">Expiré</p>
            <div className="flex items-center gap-1 mt-6">
                <PiXCircleBold size={20} className="text-blue-600" />
                <h2 className="text-2xl font-bold">13</h2>
            </div>
        </Card>
    </div>

    <div className="flex gap-4 py-4">
        <Card className="p-4 w-full">
            <p className="text-gray-700">Valeur du stock (prix d'achat)</p>
            <div className="my-5">
                <h2 className="text-2xl font-bold">13000 Fc</h2>
            </div>
        </Card>
        
        <Card className="p-4 w-full">
            <p className="text-gray-700">Valeur du stock (prix de vente)</p>
            <div className="flex flex-col mt-6 text-green-600">
                <h3 className="text-2xl font-bold">3666.00 Fc</h3>
                <h2 className="text-sm font-semibold">Marge potentielle: 1781.10 Fc</h2>
            </div>
        </Card>
    </div>

    <Card className="">
        <div className="flex justify-between items-center p-4">
            <div>
                <h3 className="font-semibold">Inventaire</h3>
                <p className="text-sm text-gray-700">10 produit(s) affiché(s)</p>
            </div>

            <div>
                <Select className="bg-gray-100">
                    <option value="">Tout les produits</option>
                    <option value="">Stock OK</option>
                    <option value="">Stock faible</option>
                    <option value="">Expire bientôt</option>
                    <option value="">Expiré</option>
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

            <tr className="text-gray-500 border-b border-gray-300">
                <td className="p-2 text-start text-gray-900 font-semibold">Doliprane 1000mg</td>
                <td className="p-2 text-start">Antalgique</td>
                <td className="p-2 text-end text-gray-900 font-semibold">150</td>
                <td className="p-2 text-start">31/12/2026</td>
                <td className="p-2 text-start">
                    {/* <div className="text-white text-center text-sm bg-red-500 p-1 rounded-lg">
                        <span className="font-semibold ">Expire bientôt</span>
                        <span className="font-semibold ">Expiré</span>
                    </div> */}
                    <div className="text-white text-center text-sm bg-yellow-500 rounded-lg">
                        <span className="font-semibold ">Stock faible</span>
                    </div>
                    {/* <div className="text-white text-center text-sm bg-green-500 rounded-lg">
                        <span className="font-semibold ">OK</span>
                    </div> */}
                </td>
            </tr>
        </table>

    </Card>

    </>)
}