import { useState, useEffect } from 'react'
import { Calendar, Download, Eye, TrendingUp, DollarSign, Package, ShoppingCart, ClipboardList, RefreshCw } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import { Link } from 'react-router-dom'
import { exportService } from '../../services/admin/export_service'
import { number } from "./../../hooks/number"
import { useForm } from 'react-hook-form'
import { formatDateToFrench } from '../../hooks/format_date'

export default function Rapports() {
    const now = new Date()
    const [filterType, setFilterType] = useState('journalier')

    const [exportDatas, setExportDatas] = useState([])
    const [load, setLoad] = useState(true)

    const {
        register: registerDay,
        watch: watchDay
    } = useForm()

    const {
        register: registerMonth,
        watch: watchMonth,
    } = useForm()

    useEffect(()=>{
        (async()=>{
            setExportDatas(await exportService.get( filterType, 
                filterType === 'mensuel' ? watchMonth('mensuel') : 
                    filterType === 'journalier' ? watchDay('journalier') : 'all'))
        })()
    },[filterType, load])   
    


    const getStatusBadge = (date) => {
        let status
        if(filterType === 'mensuel') {
            const month = now.getFullYear() + '-' + (now.getMonth()).toString().padStart(2, '0')
            status = date === month ? 'ready' : 'pending'
        } else if(filterType === 'journalier') {
            status = date === now.toISOString().slice(0, 10) ? 'pending' : 'ready'
        } else if(filterType === 'annuel') {
            status = date === now.getFullYear() ? 'ready' : 'pending'
        }
        
        if (status === 'ready') {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Prêt
                </span>
            )
        } else if (status === 'pending') {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    En cours
                </span>
            )
        }
        return null
    }

    return (
    <>
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
                                    {...registerDay('journalier',
                                        { value: now.toISOString().slice(0, 7) }
                                    )}
                                />
                                <Bouton 
                                    outline 
                                    className="flex items-center gap-2 w-full"
                                    onClick={()=> setLoad(!load)}
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
                                    min="2026"
                                    {...registerMonth('mensuel', 
                                        { value: now.getFullYear() }
                                    )}
                                />
                                <Bouton 
                                    outline 
                                    className="flex items-center gap-2 w-full"
                                    onClick={()=> setLoad(!load)}
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
                    {exportDatas?.map((item, index) => (
                        <div key={index} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-medium text-gray-900">
                                            {filterType === 'journalier' && `Rapport du : ${formatDateToFrench(item.periode)}`}
                                            {filterType === 'mensuel' && `Rapport du mois : ${formatDateToFrench(item.periode)}`}
                                            {filterType === 'annuel' && `Rapport de l'année ${item.periode}`}
                                        </h4>
                                        {getStatusBadge(item.periode)}
                                    </div>
                                    
                                    {/* Statistiques */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">Ventes</p>
                                                <p className="font-semibold text-gray-900 text-sm truncate">
                                                    {number.format(item.total_ventes)} FC
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">Bénéfice</p>
                                                <p className="font-semibold text-gray-900 text-sm truncate" >
                                                    {number.format(item.total_benefice)} FC
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
                                                    {number.format(item.capital)} FC
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
                                                    {item.total_quantite}
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
                                                    {item.nombre_commandes}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <Link to={`/admin/export-view/${filterType}/${item.periode}`}>
                                    <Bouton
                                        outline
                                        size="sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Visualiser
                                    </Bouton>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>)
}
