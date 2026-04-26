import { useState, useEffect } from 'react'
import { Bouton } from '../../../components/ui/bouton'
import { Input } from '../../../components/ui/input'
import { parametreService } from '../../../services/admin/parametre_service'
import { useForm } from 'react-hook-form'

export const RenderExportSettings = () => {

    const [loading, setLoading] = useState(false)
    const { register, reset } = useForm()
    
    useEffect(() => {
        (async()=>{
            const settings = await parametreService.getPdfSettings()
            reset({
                pdfExportPath: settings?.pdfExportPath || ''
            })
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

                </div>
            </div>
        </div>
    </>)
}