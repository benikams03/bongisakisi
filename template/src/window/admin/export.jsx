import { useState } from 'react'
import { Calendar, Download, Eye, TrendingUp, DollarSign, Package, ShoppingCart, ArrowRight, ClipboardList, RefreshCw } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import { Link } from 'react-router-dom'

export default function ExportPage() {
    const [filterType, setFilterType] = useState('journalier')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    // Données fictives pour le rendu
    const exportData = [
        {
            id: 1,
            date: '2026-04-22',
            type: 'journalier',
            status: 'ready',
            totalVentes: 125000,
            benefice: 45000,
            capital: 80000,
            produitsVendus: 89,
            nombreCommandes: 23,
            depenses: 35000
        },
        {
            id: 2,
            date: '2026-04-21',
            type: 'journalier',
            status: 'ready',
            totalVentes: 98000,
            benefice: 32000,
            capital: 66000,
            produitsVendus: 67,
            nombreCommandes: 18,
            depenses: 28000
        },
        {
            id: 3,
            date: '2026-04',
            type: 'mensuel',
            status: 'in_progress',
            totalVentes: 2850000,
            benefice: 950000,
            capital: 1900000,
            produitsVendus: 1245,
            nombreCommandes: 312,
            depenses: 850000
        },
        {
            id: 4,
            date: '2026-03',
            type: 'mensuel',
            status: 'ready',
            totalVentes: 2650000,
            benefice: 880000,
            capital: 1770000,
            produitsVendus: 1102,
            nombreCommandes: 289,
            depenses: 790000
        },
        {
            id: 5,
            date: '2025',
            type: 'annuel',
            status: 'ready',
            totalVentes: 32500000,
            benefice: 10800000,
            capital: 21700000,
            produitsVendus: 8956,
            nombreCommandes: 2245,
            depenses: 9650000
        }
    ]

    const getStatusBadge = (status) => {
        if (status === 'ready') {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Prêt
                </span>
            )
        } else if (status === 'in_progress') {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    En cours
                </span>
            )
        }
        return null
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'CDF'
        }).format(amount)
    }

    const handleRefresh = () => {
        // Simuler le rafraîchissement des données
        console.log('Actualisation des données pour:', { filterType, selectedMonth, selectedYear })
        // Ici vous pourriez ajouter un appel API pour recharger les données
    }

    const filteredData = exportData.filter(item => {
        if (filterType === 'journalier') {
            return item.type === 'journalier'
        } else if (filterType === 'mensuel') {
            return item.type === 'mensuel'
        } else if (filterType === 'annuel') {
            return item.type === 'annuel'
        }
        return true
    })

    return (
        <div className="p-2.5 h-full overflow-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Exportation des Rapports</h1>
                <p className="text-sm text-gray-600 mt-1">Générez et exportez les rapports de vente selon différentes périodes</p>
            </div>

            {/* Options de filtrage */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Période d'exportation</h3>
                        <div className="flex gap-3">
                            <Bouton
                                primary={filterType === 'journalier'}
                                outline={filterType !== 'journalier'}
                                onClick={() => setFilterType('journalier')}
                                className="flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Journalier
                            </Bouton>
                            <Bouton
                                primary={filterType === 'mensuel'}
                                outline={filterType !== 'mensuel'}
                                onClick={() => setFilterType('mensuel')}
                                className="flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Mensuel
                            </Bouton>
                            <Bouton
                                primary={filterType === 'annuel'}
                                outline={filterType !== 'annuel'}
                                onClick={() => setFilterType('annuel')}
                                className="flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Annuel
                            </Bouton>
                        </div>
                    </div>

                    {/* Options supplémentaires selon le type */}
                    <div className="w-64">
                        {filterType === 'journalier' && (
                            <div className="space-y-3">
                                <InputLabel
                                    label="Mois & Année"
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                />
                                <Bouton 
                                    outline 
                                    className="flex items-center gap-2 w-full"
                                    onClick={handleRefresh}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Actualiser
                                </Bouton>
                            </div>
                        )}
                        {filterType === 'mensuel' && (
                            <div className="space-y-3">
                                <InputLabel
                                    label="Année"
                                    type="number"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    min="2026"
                                />
                                <Bouton 
                                    outline 
                                    className="flex items-center gap-2 w-full"
                                    onClick={handleRefresh}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Actualiser
                                </Bouton>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Liste des données d'exportation */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Rapports disponibles</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {filteredData.map((item) => (
                        <div key={item.id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-medium text-gray-900">
                                            {item.type === 'journalier' && `Rapport du ${item.date}`}
                                            {item.type === 'mensuel' && `Rapport de ${item.date}`}
                                            {item.type === 'annuel' && `Rapport de l'année ${item.date}`}
                                        </h4>
                                        {getStatusBadge(item.status)}
                                    </div>
                                    
                                    {/* Statistiques */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">Ventes</p>
                                                <p className="font-semibold text-gray-900 text-sm truncate" title={formatCurrency(item.totalVentes)}>
                                                    {formatCurrency(item.totalVentes)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">Bénéfice</p>
                                                <p className="font-semibold text-gray-900 text-sm truncate" title={formatCurrency(item.benefice)}>
                                                    {formatCurrency(item.benefice)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <Package className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">Capital</p>
                                                <p className="font-semibold text-gray-900 text-sm truncate" title={formatCurrency(item.capital)}>
                                                    {formatCurrency(item.capital)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <ShoppingCart className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">Produits vendus</p>
                                                <p className="font-semibold text-gray-900 text-sm truncate" title={item.produitsVendus.toString()}>
                                                    {item.produitsVendus}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <ClipboardList className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">Nb commandes</p>
                                                <p className="font-semibold text-gray-900 text-sm truncate" title={item.nombreCommandes.toString()}>
                                                    {item.nombreCommandes}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    {filterType === 'journalier' && (
                                        <Link to={`/admin/export-view`}>
                                            <Bouton
                                                outline
                                                size="sm"
                                                disabled={item.status === 'in_progress'}
                                            >
                                                <Eye className="w-4 h-4" />
                                                Visualiser
                                            </Bouton>
                                        </Link>
                                    )}
                                    <Bouton
                                        primary
                                        size="sm"
                                        className="px-4"
                                        disabled={item.status === 'in_progress'}
                                    >
                                        <Download className="w-4 h-4" />
                                        PDF
                                    </Bouton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
