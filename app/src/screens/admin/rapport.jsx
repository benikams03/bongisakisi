import { Card } from "../../components/ui/card"
import { GiReceiveMoney } from "react-icons/gi";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FiPackage } from "react-icons/fi";
import { Bouton } from "./../../components/ui/bouton"
import { LuCalendar } from "react-icons/lu";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"

export default function Rapports() {

    // const chartData = Array.from({ length: 7 }, (_, i) => {
    //   const date = new Date()
    //   date.setDate(date.getDate() - (6 - i))

    //   return {
    //     date: date.toLocaleDateString("fr-FR", {
    //       day: "2-digit",
    //       month: "2-digit",
    //     }),
    //     revenue: Math.floor(Math.random() * 800) + 200,
    //     profit: Math.floor(Math.random() * 500) + 100,
    //   }
    // })

    const chartData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (12 - i))

        return {
        date: date.toLocaleDateString("fr-FR", {
            month: "short",
            year: "numeric",
        }),
        revenue: Math.floor(Math.random() * 5000) + 2000,
        profit: Math.floor(Math.random() * 3000) + 1000,
        }
    })

    return(<>
    
    <h3 className="font-bold text-2xl">Rapports</h3>
    <p className="text-gray-700">Analysez vos performances de vente</p>

    <div className="my-4 flex items-center gap-1">
        <Bouton>
            <LuCalendar />
            Aujourd'hui
        </Bouton>
        <Bouton outline>
            <LuCalendar />
            Par mois
        </Bouton>
        <input
            type="month"
            class="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
    </div>

    <div className="flex items-center gap-4 py-3">
        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Chiffre d'affaires</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><GiReceiveMoney size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">1000 Fc</h2>
            <p className="text-sm text-gray-700">0 ventes</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Bénéfice</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><HiMiniArrowTrendingUp size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4 text-green-600">1000 Fc</h2>
            <p className="text-sm text-gray-700">Marge: 49.0%</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Articles vendus</p>
                <div className="bg-blue-100 rounded-lg border border-blue-200 p-2"><FiPackage size={16} className="text-blue-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">10</h2>
            <p className="text-sm text-gray-700">unités</p>
        </Card>
    </div>

    <Card className="mt-2 mb-4">
        <div className="p-4">
            <div>
                <h3 className="font-semibold">Évolution des ventes</h3>
                <p className="text-sm text-gray-700">Les 7 derniers jours</p>
            </div>
        </div>

        <div className="h-[300px] my-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0000001b" />
            <XAxis dataKey="date" stroke="#0000008e" fontSize={12} />
            <YAxis stroke="#0000008e" fontSize={12} />
            <Tooltip
                contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #00000033",
                borderRadius: "8px",
                }}
                labelStyle={{ color: "#000" }}
            />
            <Bar dataKey="revenue" name="Revenu" fill="#0d4265" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Bénéfice" fill="#189b0c" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>
    </Card>
    
    <Card>
        <div className="p-4">
            <div>
                <h3 className="font-semibold">Produits les plus vendus</h3>
                <p className="text-sm text-gray-700">Aujourd'hui</p>
            </div>
        </div>

        <table className="w-full">
            <tr className="text-gray-500 border-b border-gray-300 text-sm">
                <th className="text-start p-2 font-semibold ">Rang</th>
                <th className="text-start p-2 font-semibold ">Produit</th>
                <th className="text-end p-2 font-semibold ">Quantité</th>
                <th className="text-end p-2 font-semibold ">Revenus</th>
            </tr>

            <tr className="text-gray-500 border-b border-gray-300">
                <td className="p-3 text-start text-gray-900 font-semibold">#1</td>
                <td className="p-3 text-start">Antalgique</td>
                <td className="p-3 text-end text-gray-900 font-semibold">15</td>
                <td className="p-3 text-end text-green-600 font-semibold">150 Fc</td>
            </tr>
        </table>

    </Card>
    
    </>)
}