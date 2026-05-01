import toast from 'react-hot-toast'

export const AuthService = {

    login : async (data) => {
        try {
            const res = await window.localApi.invoke('auth-login', data)
            if(res.success) {
                toast.success('Connexion réussie')
                return true
            }
            else {
                toast.error(res.error)
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la vérification de la license')
            return false
        }
    },

}