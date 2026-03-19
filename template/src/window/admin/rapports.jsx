import { useState } from 'react'
import { FileText, Download, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Calendar, Filter, BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight, Printer, Mail } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../../components/ui/input/select-ui'

export default function Rapports() {
    const [selectedPeriod, setSelectedPeriod] = useState('week')
    const [selectedReport, setSelectedReport] = useState('sales') // 'sales', 'acquisition', 'profit'

    // Données simulées pour les rapports
    const revenueStats = {
        total: '2,450,000 FC',
        change: '+12.5%',
        positive: true,
        monthly: [
            { month: 'Jan', revenue: 1800000 },
            { month: 'Fev', revenue: 2100000 },
            { month: 'Mar', revenue: 1950000 },
            { month: 'Avr', revenue: 2300000 },
            { month: 'Mai', revenue: 2450000 },
            { month: 'Jun', revenue: 2200000 }
        ]
    }

    const acquisitionStats = {
        total: '1,850,000 FC',
        change: '+8.3%',
        positive: true,
        totalAcquisitions: 156,
        monthly: [
            { month: 'Jan', acquisitions: 25, amount: 280000 },
            { month: 'Fev', acquisitions: 32, amount: 320000 },
            { month: 'Mar', acquisitions: 28, amount: 295000 },
            { month: 'Avr', acquisitions: 35, amount: 340000 },
            { month: 'Mai', acquisitions: 30, amount: 315000 },
            { month: 'Jun', acquisitions: 26, amount: 300000 }
        ]
    }

    const profitStats = {
        total: '487,500 FC',
        margin: '19.9%',
        change: '+8.2%',
        positive: true,
        monthly: [
            { month: 'Jan', profit: 320000 },
            { month: 'Fev', profit: 380000 },
            { month: 'Mar', profit: 350000 },
            { month: 'Avr', profit: 420000 },
            { month: 'Mai', profit: 487500 },
            { month: 'Jun', profit: 410000 }
        ]
    }

    const topProducts = [
        { name: 'Paracétamol 500mg', sales: 234, revenue: 468000, profit: 93600, growth: '+15%' },
        { name: 'Amoxicilline 1g', sales: 189, revenue: 226800, profit: 45360, growth: '+8%' },
        { name: 'Ibuprofène 400mg', sales: 156, revenue: 54600, profit: 10920, growth: '-3%' },
        { name: 'Vitamine C 500mg', sales: 145, revenue: 29000, profit: 5800, growth: '+22%' },
        { name: 'Doliprane 1000mg', sales: 123, revenue: 39360, profit: 7872, growth: '+5%' }
    ]


    const availableReports = [
        { name: 'Rapport des ventes journalières', description: 'Détail des ventes par jour', icon: FileText, type: 'daily' },
        { name: 'Rapport des ventes mensuelles', description: 'Synthèse mensuelle des ventes', icon: Calendar, type: 'monthly' },
        { name: 'Rapport de rentabilité', description: 'Analyse des bénéfices', icon: DollarSign, type: 'profit' },
        { name: 'Rapport des acquisitions', description: 'Analyse des acquisitions et achats', icon: ShoppingCart, type: 'acquisition' },
        { name: 'Rapport des stocks', description: 'État des stocks actuels', icon: Package, type: 'stock' }
    ]

    const renderBarChart = (data, height = 200) => {
        const maxValue = Math.max(...data.map(d => d.revenue || d.profit))
        
        return (
            <div className="relative" style={{ height: `${height}px` }}>
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                    {data.map((item, index) => {
                        const value = item.revenue || item.profit
                        const percentage = (value / maxValue) * 100
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="w-full bg-slate-200 rounded-t relative group cursor-pointer">
                                    <div 
                                        className="w-full bg-gradient-to-t from-slate-600 to-slate-400 rounded-t transition-all duration-300 group-hover:from-slate-700 group-hover:to-slate-500"
                                        style={{ height: `${percentage}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {(value / 1000).toFixed(0)}K FC
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

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
                        {['week', 'month', 'quarter', 'year'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    selectedPeriod === period
                                        ? 'bg-slate-800 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {period === 'week' ? 'Semaine' : 
                                 period === 'month' ? 'Mois' : 
                                 period === 'quarter' ? 'Trimestre' : 'Année'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            revenueStats.positive ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {revenueStats.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {revenueStats.change}
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{revenueStats.total}</h3>
                    <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            acquisitionStats.positive ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {acquisitionStats.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {acquisitionStats.change}
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{acquisitionStats.total}</h3>
                    <p className="text-sm text-gray-600">Acquisitions ({acquisitionStats.totalAcquisitions})</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            profitStats.positive ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {profitStats.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {profitStats.change}
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{profitStats.total}</h3>
                    <p className="text-sm text-gray-600">Bénéfice net ({profitStats.margin} marge)</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            {topProducts.reduce((sum, p) => sum + p.sales, 0)} ventes
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{topProducts.length}</h3>
                    <p className="text-sm text-gray-600">Produits actifs</p>
                </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Graphique des revenus mensuels */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Évolution des revenus</h3>
                        <Bouton outline className="text-sm">
                            <BarChart3 className="w-4 h-4" />
                        </Bouton>
                    </div>
                    {renderBarChart(revenueStats.monthly)}
                </div>

                {/* Top produits */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top produits du mois</h3>
                        <Bouton outline className="text-sm">
                            <Filter className="w-4 h-4" />
                        </Bouton>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                                        <p className="text-sm text-gray-600">{product.sales} ventes</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{(product.revenue / 1000).toFixed(0)}K FC</p>
                                    <p className={`text-sm font-medium ${
                                        product.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                        {product.growth}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rapports disponibles */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
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
            </div>
        </div>
    )
}
