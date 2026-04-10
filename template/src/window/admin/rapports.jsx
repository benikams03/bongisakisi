import { useState, useEffect } from 'react'
import { FileText, Download, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Calendar, Filter, BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight, Printer, Mail } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { rapportService } from "../../services/caissier/rapport_service";
import { number } from "./../../hooks/number"

export default function Rapports() {
    
    const [selectedPeriod, setSelectedPeriod] = useState('day')
    const [rapport, setRapport] = useState([])

    useEffect(()=>{ 
        (async() => {
            const result = await rapportService.getRapportAdmin(selectedPeriod);
            setRapport(result.data);
            
        })()
    },[selectedPeriod])


    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Rapports et analyses</h2>
                    <p className="text-sm text-gray-600 mt-1">Analysez vos performances commerciales</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                        {['day','week', 'month', 'year'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                    selectedPeriod === period
                                        ? 'bg-slate-800 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {period === 'day' ? 'Aujourd\'hui' : 
                                 period === 'week' ? 'Semaine' :
                                 period === 'month' ? 'Mois' : 'Année'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            number.pourcentage(rapport?.stats?.ventesDay , rapport?.stats_old?.ventesDay) >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {number.pourcentage(rapport?.stats?.ventesDay , rapport?.stats_old?.ventesDay) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {number.pourcentage(rapport?.stats?.ventesDay , rapport?.stats_old?.ventesDay)}
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{number.format(Number(rapport?.stats?.ventesDay))} FC</h3>
                    <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            number.pourcentage(Number(rapport?.stats?.ventesDay) - Number(rapport?.stats?.gainDay) , Number(rapport?.stats_old?.ventesDay) - Number(rapport?.stats_old?.gainDay)) >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {number.pourcentage(Number(rapport?.stats?.ventesDay) - Number(rapport?.stats?.gainDay) , Number(rapport?.stats_old?.ventesDay) - Number(rapport?.stats_old?.gainDay)) >= 0
                                ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {number.pourcentage(Number(rapport?.stats?.ventesDay) - Number(rapport?.stats?.gainDay) , Number(rapport?.stats_old?.ventesDay) - Number(rapport?.stats_old?.gainDay))}
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{number.format( Number(rapport?.stats?.ventesDay) - Number(rapport?.stats?.gainDay))} FC</h3>
                    <p className="text-sm text-gray-600">Fonds de roulement</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            number.pourcentage(rapport?.stats?.gainDay , rapport?.stats_old?.gainDay) >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {number.pourcentage(rapport?.stats?.gainDay , rapport?.stats_old?.gainDay) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {number.pourcentage(rapport?.stats?.gainDay , rapport?.stats_old?.gainDay)}
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{number.format(Number(rapport?.stats?.gainDay))} FC</h3>
                    <p className="text-sm text-gray-600">Bénéfice</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            {number.format(Number(rapport?.stats?.commandeDay))} ventes
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{number.format(Number(rapport?.stats?.produitDay))}</h3>
                    <p className="text-sm text-gray-600">Produits actifs</p>
                </div>
            </div>

            {/* Graphique par mois */}
            {/* <div className='mb-5'>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Évolution des revenus mensuels</h3>
                        <Bouton outline className="text-sm">
                            <BarChart3 className="w-4 h-4" />
                        </Bouton>
                    </div>
                </div>
            </div> */}

            {/* Graphiques */}
            <div className="grid grid-cols-1 gap-3">
                
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top 10 de produits vendus</h3>
                    </div>
                    <div className="space-y-3">
                        {rapport?.topVentes?.map((product, index) => (
                            <div key={index} className="flex items-center border border-gray-300 justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                                        <p className="text-sm text-gray-600">{product.quantiteTotale} ventes</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{number.format(Number(product.totalVentes))} FC</p>
                                    <p className={`text-sm ${
                                        product.stock < 10 ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                        Stock: {product.stock}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>

            {/* Rapports disponibles */}
            {/* <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Rapports disponibles</h3>
                    <div className="flex items-center gap-2">
                        <Bouton outline className="text-sm">
                            <Mail className="w-4 h-4" />
                            Envoyer par email
                        </Bouton>   
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableReports.map((report, index) => {
                        const Icon = report.icon
                        return (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
                                        <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                                        <div className="flex gap-2">
                                            <Bouton outline className="text-xs">
                                                <Download className="w-3 h-3" />
                                                PDF
                                            </Bouton>
                                            <Bouton outline className="text-xs">
                                                <FileText className="w-3 h-3" />
                                                Excel
                                            </Bouton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div> */}
        </div>
    )
}
