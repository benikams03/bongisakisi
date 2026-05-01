import { useState, useEffect } from 'react'
import { Bouton } from '../../../components/ui/bouton'
import { Input } from '../../../components/ui/input'
import { parametreService } from '../../../services/admin/parametre_service'
import { useForm } from 'react-hook-form'

export const RenderExportSettings = () => {

    const [loading, setLoading] = useState(false)
    const [printers, setPrinters] = useState([])
    const { register, reset } = useForm()
    const [cache, setCache] = useState()
    
    useEffect(() => {
        (async()=>{
            const settings = await parametreService.getPdfSettings()
            setCache(settings)
            reset({
                pdfExportPath: settings?.pdfExportPath || '',
                selectedPrinter: settings?.selectedPrinter || ''
            })
            
            // Charger la liste des imprimantes
            const availablePrinters = await parametreService.getPrinters()
            setPrinters(availablePrinters)
        })()
    }, [loading]);

    const handleBrowseFolder = async () => {
        try {
            const result = await parametreService.openFolderDialog()
            if (result !== null) {
                await parametreService.savePdfSettings({ pdfExportPath: result })
                setLoading(!loading)
            }
        } catch (error) {
            console.error('Erreur lors de la sélection du dossier:', error)
        }
    }


    return(<>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres d'exportation PDF</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emplacement d'exportation des fichiers PDF
                        </label>
                        <div className="flex gap-2 w-full">
                            <div className='w-full'>
                                <Input
                                    type='text'
                                    {...register('pdfExportPath')}
                                    className='w-full'
                                    disabled
                                />
                            </div>
                            <Bouton outline onClick={handleBrowseFolder}>
                                Parcourir
                            </Bouton>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Dossier où les fichiers PDF générés seront enregistrés
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imprimante pour les tickets
                        </label>
                        <select
                            {...register('selectedPrinter',{
                                onChange: async (e) => {
                                    await parametreService.savePdfSettings({ 
                                        pdfExportPath: cache?.pdfExportPath,
                                        selectedPrinter: e.target.value
                                    })
                                    setLoading(!loading)
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value={cache?.selectedPrinter || ''}>{cache?.selectedPrinter || 'Sélectionner une imprimantee'}</option>
                            {printers?.map((printer) => {
                                return printer.name === cache?.selectedPrinter ? null : (
                                    <option key={printer.name} value={printer.name}>
                                        {printer.name}
                                    </option>
                                )
                            })}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Imprimante utilisée pour l'impression des tickets de caisse
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </>)
}