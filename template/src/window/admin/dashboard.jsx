import { useState } from 'react'
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'

export default function Dashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('day')

    // Données simulées pour le dashboard
    const stats = [
        {
            title: 'Chiffre d\'affaires',
            value: '2,450,000 FC',
            change: '+12.5%',
            positive: true,
            icon: DollarSign,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Produits vendus',
            value: '1,234',
            change: '+8.2%',
            positive: true,
            icon: Package,
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            title: 'Commandes',
            value: '456',
            change: '-3.1%',
            positive: false,
            icon: ShoppingCart,
            color: 'from-purple-500 to-purple-600'
        },
    ]

    const topProducts = [
        { name: 'Paracétamol 500mg', sales: 234, revenue: '351,000 FC', stock: 156 },
        { name: 'Amoxicilline 1g', sales: 189, revenue: '226,800 FC', stock: 89 },
        { name: 'Ibuprofène 400mg', sales: 156, revenue: '109,200 FC', stock: 234 },
        { name: 'Vitamine C 500mg', sales: 145, revenue: '11,600 FC', stock: 445 },
        { name: 'Doliprane 1000mg', sales: 123, revenue: '39,360 FC', stock: 67 }
    ]

    const recentActivities = [
        { id: 1, type: 'sale', description: 'Vente de Paracétamol 500mg', time: 'Il y a 2 minutes', amount: '3,000 FC' },
        { id: 2, type: 'stock', description: 'Rupture de stock: Amoxicilline 1g', time: 'Il y a 15 minutes', amount: '' },
        { id: 3, type: 'purchase', description: 'Nouvelle commande fournisseur', time: 'Il y a 1 heure', amount: '450,000 FC' },
        { id: 4, type: 'sale', description: 'Vente de Vitamine C 500mg', time: 'Il y a 2 heures', amount: '800 FC' },
        { id: 5, type: 'alert', description: 'Produit expirant dans 7 jours', time: 'Il y a 3 heures', amount: '' }
    ]

    const lowStockProducts = [
        { name: 'Amoxicilline 1g', stock: 12, minStock: 20 },
        { name: 'Doliprane 1000mg', stock: 8, minStock: 15 },
        { name: 'Arthotec 50mg', stock: 5, minStock: 10 }
    ]

    const getActivityIcon = (type) => {
        switch(type) {
            case 'sale': return <ShoppingCart className="w-4 h-4" />
            case 'stock': return <Package className="w-4 h-4" />
            case 'purchase': return <DollarSign className="w-4 h-4" />
            case 'alert': return <AlertTriangle className="w-4 h-4" />
            default: return <Package className="w-4 h-4" />
        }
    }

    const getActivityColor = (type) => {
        switch(type) {
            case 'sale': return 'bg-emerald-100 text-emerald-600'
            case 'stock': return 'bg-red-100 text-red-600'
            case 'purchase': return 'bg-blue-100 text-blue-600'
            case 'alert': return 'bg-orange-100 text-orange-600'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

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
                        {['day', 'week', 'month', 'year'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top produits */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top produits vendus</h3>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                                        <p className="text-sm text-gray-600">{product.sales} ventes</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{product.revenue}</p>
                                    <p className={`text-sm ${
                                        product.stock < 20 ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                        Stock: {product.stock}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activités récentes */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Activités récentes</h3>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 truncate">{activity.description}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                                {activity.amount && (
                                    <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alertes stock faible */}
            {lowStockProducts.length > 0 && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-red-900">Alertes de stock faible</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {lowStockProducts.map((product, index) => (
                            <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                    <span className="text-sm font-medium text-red-600">
                                        {product.stock} / {product.minStock}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-red-600 h-2 rounded-full"
                                        style={{ width: `${(product.stock / product.minStock) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
