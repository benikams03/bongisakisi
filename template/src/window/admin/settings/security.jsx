import { useState } from 'react'
import { Bouton } from '../../../components/ui/bouton'
import { Password } from '../../../components/ui/input/password'
import { parametreService } from '../../../services/admin/parametre_service'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export const RenderSecuritySettings = () => {

    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()
    const newPassword = watch('newPassword')

    const onSubmit = async (data) => {
        setLoading(true)
        
        try {
            const result = await parametreService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })

            if (result.success) {
                toast.success('Mot de passe modifié avec succès')
                reset()
            } else {
                toast.error(result.error || 'Erreur lors de la modification du mot de passe')
            }
        } catch {
            toast.error('Erreur lors de la modification du mot de passe')
        } finally {
            setLoading(false)
        }
    }

    return(<>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de sécurité</h3>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-md font-medium text-gray-800 mb-4">Modifier le mot de passe administrateur</h4>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mot de passe actuel
                                </label>
                                <Password
                                    {...register('currentPassword', {
                                        required: 'Le mot de passe actuel est requis'
                                    })}
                                    error={errors.currentPassword}
                                    helperText={errors.currentPassword?.message}
                                    placeholder="Entrez votre mot de passe actuel"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nouveau mot de passe
                                </label>
                                <Password
                                    {...register('newPassword', {
                                        required: 'Le nouveau mot de passe est requis',
                                        minLength: {
                                            value: 5,
                                            message: 'Le mot de passe doit contenir au moins 5 caractères'
                                        }
                                    })}
                                    error={errors.newPassword}
                                    helperText={errors.newPassword?.message}
                                    placeholder="Entrez le nouveau mot de passe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmer le nouveau mot de passe
                                </label>
                                <Password
                                    {...register('confirmPassword', {
                                        required: 'Veuillez confirmer le nouveau mot de passe',
                                        validate: value => value === newPassword || 'Les mots de passe ne correspondent pas'
                                    })}
                                    error={errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    placeholder="Confirmez le nouveau mot de passe"
                                />
                            </div>

                            <div className="pt-4">
                                <Bouton
                                    type="submit"
                                    primary
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? 'Modification en cours...' : 'Confirmer la modification'}
                                </Bouton>
                            </div>
                        </form>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h5 className="text-sm font-medium text-blue-800 mb-2">
                                Informations de sécurité
                            </h5>
                            <ul className="text-xs text-blue-600 space-y-1">
                                <li>• Le mot de passe doit contenir au moins 5 caractères</li>
                                <li>• Utilisez un mot de passe unique et sécurisé</li>
                                <li>• Ne partagez jamais votre mot de passe</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
