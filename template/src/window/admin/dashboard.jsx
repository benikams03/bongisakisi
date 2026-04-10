import { useState, useEffect } from 'react'
import { Package, DollarSign, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react'
import { rapportService } from "../../services/caissier/rapport_service";
import { number } from "./../../hooks/number"
import { formatDateToDMY } from "../../hooks/format_date"

export default function Dashboard() {
    
    const [selectedPeriod, setSelectedPeriod] = useState('day')
    const [rapport, setRapport] = useState([])
    const [lowStockItems, setLowStockItems] = useState([])
    const [expiredItems, setExpiredItems] = useState([])
    const [expiringSoonItems, setExpiringSoonItems] = useState([])

    useEffect(()=>{ 
        (async() => {
            const result = await rapportService.getStatDashbord(selectedPeriod);
            setRapport(result.data);
        })()
    },[selectedPeriod])

    useEffect(() => {
        (async() => {
            // Récupérer les stocks faibles
            const lowStockResponse = await rapportService.getLowStockItems();
            setLowStockItems(lowStockResponse);

            // Récupérer les médicaments expirés
            const expiredResponse = await rapportService.getExpiredItems();
            setExpiredItems(expiredResponse?.expired);
            setExpiringSoonItems(expiredResponse?.expiringSoon); 
        })()
    }, [])

    // Données simulées pour le dashboard
    const stats = [
        {
            title: 'Chiffre d\'affaires',
            value: number.format(Number(rapport?.stats?.ventesDay)) + ' FC',
            change: number.pourcentage(rapport?.stats?.ventesDay , rapport?.stats_old?.ventesDay) + '%',
            positive: number.pourcentage(rapport?.stats?.ventesDay , rapport?.stats_old?.ventesDay) >= 0 ? true : false ,
            icon: DollarSign,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Produits vendus',
            value: number.format(Number(rapport?.stats?.produitDay)),
            change: number.pourcentage(rapport?.stats?.produitDay , rapport?.stats_old?.produitDay) + '%',
            positive: number.pourcentage(rapport?.stats?.produitDay , rapport?.stats_old?.produitDay) >= 0 ? true : false ,
            icon: Package,
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            title: 'Commandes',
            value: number.format(Number(rapport?.stats?.commandeDay)),
            change: number.pourcentage(rapport?.stats?.commandeDay , rapport?.stats_old?.commandeDay) + '%',
            positive: number.pourcentage(rapport?.stats?.commandeDay , rapport?.stats_old?.commandeDay) >= 0 ? true : false ,
            icon: ShoppingCart,
            color: 'from-purple-500 to-purple-600'
        },
    ]

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
                    <p className="text-sm text-gray-600 mt-1">Vue d'ensemble de votre pharmacie</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                        {['day', 'week'].map((period) => (
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
                                 period === 'week' ? 'Semaine' : ''}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-5">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${
                                    stat.positive ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                    {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-600">{stat.title}</p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-2 gap-5">
 
                {/* Stocks faibles */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Stocks faibles</h3>
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="space-y-3">
                        {lowStockItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                                </div>
                                <div className="text-right">
                                    { item.stock === 0 ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Épuisé
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            Faible
                                        </span>
                                    ) }
                                </div>
                            </div>
                        ))}
                        {lowStockItems.length === 0 && (
                            <div className="text-center py-8">
                                <Package className="w-12 h-22 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Tous les stocks sont suffisants</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Médicaments expirés */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Médicaments expirés</h3>
                        <Calendar className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="space-y-3">
                        {expiredItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-200">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">Expire le: {formatDateToDMY(item.date_expiration)}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Expiré
                                    </span>
                                </div>
                            </div>
                        ))}
                        {expiringSoonItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg border border-orange-200">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">Expire le: {formatDateToDMY(item.date_expiration)}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                        Bientôt
                                    </span>
                                </div>
                            </div>
                        ))}
                        {expiredItems.length === 0 && expiringSoonItems.length === 0 && (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-22 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Aucun médicament expiré</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
