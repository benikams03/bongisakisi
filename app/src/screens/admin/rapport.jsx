/* eslint-disable react-hooks/rules-of-hooks */
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
import { useState, useEffect } from "react";
import { useFormMoney } from "../../utils/useMoney";

export default function Rapports() {

    const [stats, setStats] = useState([]);
    const [bestVent, setBestVent] = useState([]);
    const [chartDatas, setChartDatas] = useState([]);
    const [chartDatasMonth, setChartDatasMonth] = useState([]);
    const [bestVenteMonth, setBestVenteMonth] = useState([]);
    const [statsMonth, setStatsMonth] = useState([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const date = await window.electron.stats_day();
                const date2 = await window.electron.rapport_bestVent();
                const data3 = await window.electron.achats_getAllChart_week();
                const data4 = await window.electron.achats_getAllChart_month();
                const date5 = await window.electron.rapport_bestventeMonth();
                const date6 = await window.electron.stats_month();
                setStats(date);
                setBestVent(date2);
                setChartDatas(data3);
                setChartDatasMonth(data4);
                setBestVenteMonth(date5);
                setStatsMonth(date6);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }  
        }
        fetchCategories();
    }, [])

    // -----------------------------------------------------------------------------------------
    const [focus, setFocus] = useState(1)

    return(<>
    
    <h3 className="font-bold text-2xl">Rapports</h3>
    <p className="text-gray-700">Analysez vos performances de vente</p>{focus}

    <div className="my-4 flex items-center gap-1">
        <Bouton
            outline={ focus === 1 ? false : true }
            onClick={ () => setFocus(1) }>
            <LuCalendar />
            Aujourd'hui
        </Bouton>

        <Bouton 
            outline={ focus === 2 ? false : true }
            onClick={ () => setFocus(2) }>
            <LuCalendar />
            Par mois
        </Bouton>
    </div>

    <div className="flex gap-4 py-3">
        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Chiffre d'affaires</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><GiReceiveMoney size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">{useFormMoney( focus === 1 ? stats.totalPrix : statsMonth.totalPrix)} Fc</h2>
            <p className="text-sm text-gray-700">{focus === 1 ? stats.totalAchats : statsMonth.totalAchats} ventes</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Bénéfice</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><HiMiniArrowTrendingUp size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4 text-green-600">{useFormMoney( focus === 1 ? stats.totalBenefice : statsMonth.totalBenefice)} Fc</h2>
            <p className="text-sm text-gray-700">Marge: {((focus === 1 ? stats.totalBenefice : statsMonth.totalBenefice) / (focus === 1 ? stats.totalPrix : statsMonth.totalPrix) * 100).toFixed(2)}%</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Articles vendus</p>
                <div className="bg-blue-100 rounded-lg border border-blue-200 p-2"><FiPackage size={16} className="text-blue-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">{focus === 1 ? stats.totalunite : statsMonth.totalunite}</h2>
            <p className="text-sm text-gray-700">unités</p>
        </Card>
    </div>

    <Card className="mt-2 mb-4">
        <div className="p-4">
            <div>
                <h3 className="font-semibold">Évolution des ventes</h3>
                <p className="text-sm text-gray-700">
                    {focus === 1 ? "Les 7 derniers jours" : "Les 12 derniers mois"}
                </p>
            </div>
        </div>

        <div className="h-[300px] my-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ focus === 1 ? chartDatas : chartDatasMonth }>
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
                <p className="text-sm text-gray-700">
                    {focus === 1 ? "Aujourd'hui" : "Ce mois-ci"}</p>
            </div>
        </div>

        <table className="w-full">
            <tr className="text-gray-500 border-b border-gray-300 text-sm">
                <th className="text-start p-2 font-semibold ">Rang</th>
                <th className="text-start p-2 font-semibold ">Produit</th>
                <th className="text-end p-2 font-semibold ">Quantité</th>
                <th className="text-end p-2 font-semibold ">Revenus</th>
            </tr>
            
            { focus === 1 ? 
                bestVent.map((valeur, index) => (
                <tr key={index} className="text-gray-500 border-b border-gray-300">
                    <td className="p-3 text-start text-gray-900 font-semibold">#{index + 1}</td>
                    <td className="p-3 text-start">{valeur.nom}</td>
                    <td className="p-3 text-end text-gray-900 font-semibold">{valeur.quantite}</td>
                    <td className="p-3 text-end text-green-600 font-semibold">{useFormMoney(valeur.benefice)} Fc</td>
                </tr>))
                :
                bestVenteMonth.map((valeur, index) => (
                <tr key={index} className="text-gray-500 border-b border-gray-300">
                    <td className="p-3 text-start text-gray-900 font-semibold">#{index + 1}</td>
                    <td className="p-3 text-start">{valeur.nom}</td>
                    <td className="p-3 text-end text-gray-900 font-semibold">{valeur.quantite}</td>
                    <td className="p-3 text-end text-green-600 font-semibold">{useFormMoney(valeur.benefice)} Fc</td>
                </tr>))
            }
        </table>

    </Card>
    
    </>)
}