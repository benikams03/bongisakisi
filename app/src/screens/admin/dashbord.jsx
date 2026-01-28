/* eslint-disable react-hooks/rules-of-hooks */
import { Card } from "../../components/ui/card"
import { GiReceiveMoney } from "react-icons/gi";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FiPackage } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useFormMoney } from "../../utils/useMoney";
import { useFormatDateToLabel } from "../../utils/useFormatDateHeureLabel"

export default function Dashbord() {

    const [stats, setStats] = useState([]);
    const [Medeciments, setMedeciments] = useState([]);
    const [lastAchat, setLastAchat] = useState([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const date = await window.electron.stats_day();
                const data2 = await window.electron.getMedicaments();
                const data3 = await window.electron.getAchatLimit();
                setMedeciments(data2);
                setStats(date);
                setLastAchat(data3);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }  
        }
        fetchCategories();
    }, [])

    return(<>
    
    <h3 className="font-bold text-2xl">Tableau de bord</h3>
    <p className="text-gray-700">Vue d'ensemble de votre pharmacie</p>

    <div className="flex gap-4 py-3">
        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Ventes du jour</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><GiReceiveMoney size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">{useFormMoney(stats.totalPrix)} Fc</h2>
            <p className="text-sm text-gray-700">{stats.totalAchats} ventes</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Bénéfice du jour</p>
                <div className="bg-green-100 rounded-lg border border-green-200 p-2"><HiMiniArrowTrendingUp size={16} className="text-green-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">{useFormMoney(stats.totalBenefice)} Fc</h2>
            <p className="text-sm text-gray-700">Marge brute</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Total médicaments</p>
                <div className="bg-blue-100 rounded-lg border border-blue-200 p-2"><FiPackage size={16} className="text-blue-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">{Medeciments.length}</h2>
            <p className="text-sm text-gray-700">En catalogue</p>
        </Card>

        <Card className="p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">Alertes stock</p>
                <div className="bg-yellow-100 rounded-lg border border-yellow-200 p-2"><FiAlertTriangle size={16} className="text-yellow-600" /></div>
            </div>
            <h2 className="text-2xl font-bold pt-4">{ Medeciments.filter(m => m.statut !== 'Stock OK').length }</h2>
            <p className="text-sm text-gray-700">
                { Medeciments.filter(m => m.statut === 'Stock faible').length } faibles, 
                { Medeciments.filter(m => m.statut === 'Stock critique').length } Critique <br /> 
                { Medeciments.filter(m => m.statut === 'Expirera').length } expirant</p>
        </Card>
    </div>

    <div className="flex items-start gap-4 mt-2">
        <Card className="w-full p-4">
            <h3 className="text-lg font-semibold">Ventes récentes</h3>
            <p className="text-gray-700 text-sm">Les dernières transactions</p>

            <div className="flex flex-col gap-2 pt-4">
                { lastAchat.map((valeur, index) => (
                    <Card key={index} className="px-3 py-2 bg-gray-100">
                        <div className="font-bold flex justify-between items-center">
                            <p className="text-sm">{valeur.totalArticles} article(s) </p>
                            <p className="text-lg text-green-600">{useFormMoney(valeur.totalPrix)} Fc</p>
                        </div>
                        <div className="text-xs font-semibold flex justify-between items-center">
                            <p className="text-gray-600">{useFormatDateToLabel(valeur.datecreate)}</p>
                            <p className="text-green-600">+{useFormMoney(valeur.totalBenefice)} Fc</p>
                        </div>
                    </Card>
                ))}
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