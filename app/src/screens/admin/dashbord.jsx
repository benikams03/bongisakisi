import { Card } from "../../components/ui/card"
import { GiReceiveMoney } from "react-icons/gi";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FiPackage } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";

export default function Dashbord() {
    return(<>
    
    <h3 className="font-bold text-2xl">Tableau de bord</h3>
    <p className="text-gray-700">Vue d'ensemble de votre pharmacie</p>

    <div className="flex items-center gap-4 py-3">
        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Ventes du jour</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><GiReceiveMoney size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">1000 Fc</h2>
            <p className="text-sm text-gray-700">0 ventes</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Bénéfice du jour</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><HiMiniArrowTrendingUp size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">1000 Fc</h2>
            <p className="text-sm text-gray-700">Marge brute</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Total médicaments</p>
                <div className="bg-blue-100 rounded-lg border border-blue-200 p-2"><FiPackage size={16} className="text-blue-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">10</h2>
            <p className="text-sm text-gray-700">En catalogue</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Alertes stock</p>
                <div className="bg-yellow-100 rounded-lg border border-yellow-200 p-2"><FiAlertTriangle size={16} className="text-yellow-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">5</h2>
            <p className="text-sm text-gray-700">2 faibles, 3 expirant</p>
        </Card>
    </div>

    <div className="flex items-start gap-4 mt-2">
        <Card className="w-full p-4">
            <h3 className="text-lg font-semibold">Ventes récentes</h3>
            <p className="text-gray-700 text-sm">Les dernières transactions</p>

            <div className="flex flex-col gap-2 pt-4">
                <Card className="px-3 py-2 bg-gray-100">
                    <div className="font-bold flex justify-between items-center">
                        <p className="text-sm">2 article(s)</p>
                        <p className="text-lg text-green-600">200Fc</p>
                    </div>
                    <div className="text-xs font-semibold flex justify-between items-center">
                        <p className="text-gray-600">18/01/2026 09:30:00</p>
                        <p className="text-green-600">+200Fc</p>
                    </div>
                </Card>
            </div>
        </Card>

        <Card className="w-full p-4">
            <h3 className="text-lg font-semibold">Alertes de stock</h3>
            <p className="text-gray-700 text-sm">Médicaments nécessitant attention</p>

            <div className="flex flex-col gap-2 pt-4">
                <Card className="px-3 py-2 bg-gray-100 flex justify-between items-center">
                    <div className="font-semibold">
                        <p className="text-sm font-bold ">Amoxicilline 500mg</p>
                        <p className="text-xs text-red-600">Expire dans 30 jours</p>
                    </div>
                    <FiAlertTriangle  className="text-red-600" />
                </Card>
                <Card className="px-3 py-2 bg-gray-100 flex justify-between items-center">
                    <div className="font-semibold">
                        <p className="text-sm font-bold ">Amoxicilline 500mg</p>
                        <p className="text-xs text-yellow-500">Stock: 8</p>
                    </div>
                    <FiAlertTriangle  className="text-yellow-500" />
                </Card>
            </div>
        </Card>

    </div>

    </>)
}