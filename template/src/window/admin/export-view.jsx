import { useState } from 'react'
import { ArrowLeft, Download, TrendingUp, DollarSign, Package, ShoppingCart, ArrowRight, Calendar, Filter, Search, ClipboardList } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { Input } from '../../components/ui/input'
import { Link } from 'react-router-dom'

export default function ExportViewPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')

    // Données fictives pour le tableau de ventes
    const salesData = [
        { id: 1, date: '2026-04-22', product: 'Paracétamol 500mg', category: 'Antalgiques', quantity: 15, unitPrice: 250, total: 3750, supplier: 'PharmaPlus' },
        { id: 2, date: '2026-04-22', product: 'Amoxicilline 1g', category: 'Antibiotiques', quantity: 8, unitPrice: 1200, total: 9600, supplier: 'MediSupply' },
        { id: 3, date: '2026-04-22', product: 'Ibuprofène 400mg', category: 'Antalgiques', quantity: 12, unitPrice: 350, total: 4200, supplier: 'PharmaPlus' },
        { id: 4, date: '2026-04-22', product: 'Vitamine C 500mg', category: 'Vitamines', quantity: 25, unitPrice: 150, total: 3750, supplier: 'HealthCorp' },
        { id: 5, date: '2026-04-21', product: 'Doliprane 1000mg', category: 'Antalgiques', quantity: 20, unitPrice: 400, total: 8000, supplier: 'PharmaPlus' },
        { id: 6, date: '2026-04-21', product: 'Augmentin 625mg', category: 'Antibiotiques', quantity: 6, unitPrice: 2800, total: 16800, supplier: 'MediSupply' },
        { id: 7, date: '2026-04-21', product: 'Aspirine 100mg', category: 'Antalgiques', quantity: 30, unitPrice: 100, total: 3000, supplier: 'HealthCorp' },
        { id: 8, date: '2026-04-20', product: 'Arnica 30CH', category: 'Homéopathie', quantity: 10, unitPrice: 800, total: 8000, supplier: 'BioPharma' },
        { id: 9, date: '2026-04-20', product: 'Bactrim 400mg', category: 'Antibiotiques', quantity: 4, unitPrice: 1500, total: 6000, supplier: 'MediSupply' },
        { id: 10, date: '2026-04-20', product: 'Collagène 1000mg', category: 'Suppléments', quantity: 15, unitPrice: 2200, total: 33000, supplier: 'HealthCorp' }
    ]

    // Statistiques calculées
    const totalVentes = salesData.reduce((sum, item) => sum + item.total, 0)
    const totalQuantite = salesData.reduce((sum, item) => sum + item.quantity, 0)
    const beneficeTotal = totalVentes * 0.36 // 36% de bénéfice
    const capitalTotal = totalVentes * 0.64 // 64% de capital
    const produitsVendus = totalQuantite // Nombre total de produits vendus
    const nombreCommandes = salesData.length // Nombre de commandes

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'CDF'
        }).format(amount)
    }

    const filteredData = salesData.filter(item => {
        const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory
        return matchesSearch && matchesCategory
    })

    const categories = ['all', ...new Set(salesData.map(item => item.category))]

    return (
        <div className="p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Visualisation du rapport</h1>
                        <p className="text-gray-600">Rapport de vente du 22 Avril 2026</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Bouton primary className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Exporter en PDF
                    </Bouton>
                    <Link to="/admin/export">
                        <Bouton outline className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Changer la période
                        </Bouton>
                    </Link>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-lg shadow-xs border border-gray-200 p-6 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Ventes</p>
                        <p className="font-semibold text-gray-900 text-sm truncate" title={formatCurrency(totalVentes)}>
                            {formatCurrency(totalVentes)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Bénéfice</p>
                        <p className="font-semibold text-gray-900 text-sm truncate" title={formatCurrency(beneficeTotal)}>
                            {formatCurrency(beneficeTotal)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Capital</p>
                        <p className="font-semibold text-gray-900 text-sm truncate" title={formatCurrency(capitalTotal)}>
                            {formatCurrency(capitalTotal)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Produits vendus</p>
                        <p className="font-semibold text-gray-900 text-sm truncate" title={produitsVendus.toString()}>
                            {produitsVendus}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Nb commandes</p>
                        <p className="font-semibold text-gray-900 text-sm truncate" title={nombreCommandes.toString()}>
                            {nombreCommandes}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-6">
                <div className="flex-1">
                    <Input 
                        icons={<Search />}
                        type='search'
                        placeholder="Rechercher un produit, catégorie ou fournisseur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                </div>
            </div>

            {/* Tableau des ventes */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Détail des ventes</h3>
                    <p className="text-sm text-gray-600 mt-1">{filteredData.length} ventes trouvées</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(item.date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.product}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(item.unitPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
