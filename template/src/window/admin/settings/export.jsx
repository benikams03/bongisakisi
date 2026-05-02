import { useState, useEffect } from 'react'
import { Bouton } from '../../../components/ui/bouton'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/input/select'
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
                if(cache?.selectedPrinter){
                    await parametreService.savePdfSettings({ 
                        pdfExportPath: result, 
                        selectedPrinter: cache.selectedPrinter 
                    })
                }else{
                    await parametreService.savePdfSettings({ pdfExportPath: result })
                }
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
                        <Select label={'Imprimante pour les tickets'}
                            {...register('selectedPrinter',{
                                onChange: async (e) => {
                                    await parametreService.savePdfSettings({ 
                                        pdfExportPath: cache?.pdfExportPath,
                                        selectedPrinter: e.target.value
                                    })
                                    setLoading(!loading)
                                }
                            })}
                            defaultValue={cache?.selectedPrinter}
                            placeholder={'Sélectionner une imprimantee'}
                            >
                                {printers?.map((printer) => (
                                        <option key={printer.name} value={printer.name}>
                                            {printer.name}
                                        </option>
                                    )
                                )}
                        </Select>

                        <p className="text-xs text-gray-500 mt-1">
                            Imprimante utilisée pour l'impression des tickets de caisse
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </>)
}