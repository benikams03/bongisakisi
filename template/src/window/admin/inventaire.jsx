import { useState } from 'react'
import { Package, DollarSign, TrendingUp, Wallet } from 'lucide-react'
import { number } from '../../hooks/number'

export default function Inventaire() {
    // Données fictives pour démonstration
    const [stats] = useState({
        totalMedicaments: 156,
        capitalVente: 2450000,
        prixAchatTotal: 1850000
    })

    return (
        <div className="p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Statistiques d'inventaire</h1>
                <p className="text-gray-600 mt-1">Vue d'ensemble de votre stock et capital</p>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Nombre de médicaments */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalMedicaments}</h3>
                    <p className="text-sm text-gray-600">Médicaments en stock</p>
                </div>

                {/* Capital de vente */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{number.format(stats.capitalVente)} FC</h3>
                    <p className="text-sm text-gray-600">Capital si tout est vendu</p>
                </div>

                {/* Prix total d'achat */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{number.format(stats.prixAchatTotal)} FC</h3>
                    <p className="text-sm text-gray-600">Prix total d'achat</p>
                </div>
            </div>

            {/* Résumé */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Résumé financier</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="text-sm text-gray-600 mb-1">Bénéfice potentiel</p>
                        <p className="text-2xl font-bold text-emerald-700">{number.format(stats.capitalVente - stats.prixAchatTotal)} FC</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Marge bénéficiaire</p>
                        <p className="text-2xl font-bold text-blue-700">{((stats.capitalVente - stats.prixAchatTotal) / stats.prixAchatTotal * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
