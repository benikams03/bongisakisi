import { useState, useEffect } from 'react'
import { Download, TrendingUp, DollarSign, Package, ShoppingCart, Calendar, Search, ClipboardList } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { Input } from '../../components/ui/input'
import { Link, useParams } from 'react-router-dom'
import { exportService } from '../../services/admin/export_service'
import { number } from '../../hooks/number'
import LoadExportPDFModal from '../../components/common/modal/loadExportPDF'
import { formatDateToFrench } from '../../hooks/format_date'

export default function ExportViewPage() {
    const { type, date } = useParams()
    const [data, setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showExportModal, setShowExportModal] = useState(false)

    const [res_export, setResExport] = useState(null)

    useEffect(()=>{
        (async()=>{
            setData(await exportService.getBy(type, date))
        })()
    },[])

    // pour exporter en PDF
    const handleExportPDF = async () => {
        await setShowExportModal(true)
        const result = await exportService.exportPdf(data, type)
        setResExport(result)
    }
    

    return (
    <>
        <div className="p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Visualisation du rapport</h1>
                        <p className="text-gray-600">Rapport de vente : {data?.head && data.head[0] ? formatDateToFrench(data?.head[0]?.periode) : ''}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Bouton onClick={handleExportPDF} primary className="flex items-center gap-2">
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
                        <p className="font-semibold text-gray-900 text-sm truncate">
                            {number.format(data?.head && data.head[0] ? data?.head[0]?.total_ventes : 0)} FC
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Bénéfice</p>
                        <p className="font-semibold text-gray-900 text-sm truncate">
                            {number.format(data?.head && data.head[0] ? data?.head[0]?.total_benefice : 0)} FC
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Capital</p>
                        <p className="font-semibold text-gray-900 text-sm truncate">
                            {number.format(data?.head && data.head[0] ? data?.head[0]?.capital : 0)} FC
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Produits vendus</p>
                        <p className="font-semibold text-gray-900 text-sm truncate">
                            {data?.head && data.head[0] ? data?.head[0]?.total_quantite : 0}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 truncate">Commandes</p>
                        <p className="font-semibold text-gray-900 text-sm truncate">
                            {data?.head && data.head[0] ? data.head[0].nombre_commandes : 0}
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
                    <p className="text-sm text-gray-600 mt-1">{data?.body?.length} produit(s) ont été vendu(s)</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numero</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data?.body?.map((item, index) => {
                                const view = item.nom_produit.toLowerCase().includes(searchTerm.toLowerCase())
                                if (!view) return null
                                return(
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.nom_produit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                {item.categorie}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.quantite_totale}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {number.format(item.prix_unitaire)} FC
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {number.format(item.prix_total_vendu)} FC
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <LoadExportPDFModal
            path={res_export}
            open={showExportModal}
            onClose={() => setShowExportModal(false)}
        />
    </>)
}
