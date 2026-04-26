import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Bouton } from '../../../components/ui/bouton'
import { InputLabel } from '../../../components/ui/input'
import { parametreService } from '../../../services/admin/parametre_service'
import { useForm } from 'react-hook-form'


export const RenderGeneralSettings = () => {
    const [load, setLoad] = useState(false)

    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: { errors: errorsUpdate },
        reset: resetUpdate,
    } = useForm()

    
    useEffect(() => {
        (async () => {
            const res = (await parametreService.getSettings()).data
            resetUpdate({
                name: res?.name,
                email: res?.email,
                phone: res?.phone,
                address: res?.address,
            })
        })()
    },[load])
    
    const handleUpdateSettings = async (data) => {
        const success = await parametreService.updateSettings(data)
        if(success) { 
            setLoad(!load)
        }
    }
    
    return(
        <div className="space-y-6">
            <form method='post' onSubmit={handleSubmitUpdate(handleUpdateSettings)}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de la pharmacie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputLabel 
                        label="Nom de la pharmacie"
                        type='text'
                        {...registerUpdate('name', {
                            required: 'Le nom du produit est obligatoire',
                            minLength: {    
                                value: 2,
                                message: 'Le nom du produit doit contenir au moins 2 caractères'
                            }
                        })}
                        error={!!errorsUpdate.name}
                        helperText={errorsUpdate.name?.message}
                    />
                    <InputLabel 
                        label="Email"
                        type="email"
                        {...registerUpdate('email', {
                            required: 'L\'email est obligatoire',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email invalide'
                            }
                        })}
                        error={!!errorsUpdate.email}
                        helperText={errorsUpdate.email?.message}
                    />
                    <InputLabel 
                        label="Téléphone"
                        type="tel"
                        {...registerUpdate('phone', {
                            required: 'Le téléphone est obligatoire',
                        })}
                        error={!!errorsUpdate.phone}
                        helperText={errorsUpdate.phone?.message}
                    />
                    <div className="md:col-span-2">
                        <InputLabel 
                            label="Adresse"
                            type="text"
                            {...registerUpdate('address', {
                                required: 'L\'adresse est obligatoire',
                            })}
                            error={!!errorsUpdate.address}
                            helperText={errorsUpdate.address?.message}
                        />
                    </div>
                    
                    <Bouton primary type='submit'>
                        <Save className="w-4 h-4" />
                        Sauvegarder
                    </Bouton>
                </div>
            </form>
        </div>
    )
}