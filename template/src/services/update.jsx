import toast from 'react-hot-toast'

export const updateService = {

    check : async () => {
        try {
            // Vérifier d'abord la connexion internet
            if (!navigator.onLine) {
                toast.error('Aucune connexion internet')
                return { offline: true }
            }
            return await window.localApi.invoke('check-update')
        }
        catch (error) {
            if (error.message && error.message.includes('network')) {
                toast.error('Aucune connexion internet')
                return { offline: true }
            }
            toast.error('Erreur lors de la vérification des mises à jour')
            return false
        }
    },

    start_update : async () => {
        try{ 
            // Vérifier d'abord la connexion internet
            if (!navigator.onLine) {
                toast.error('Aucune connexion internet')
                return { offline: true }
            }
            const result = await window.localApi.invoke('start-update')
            if (result && !result.success) {
                toast.error(result.error || 'Erreur lors du téléchargement')
                return { error: true, message: result.error }
            }
            return result
        }
        catch (error) {
            if (error.message && error.message.includes('network')) {
                toast.error('Aucune connexion internet')
                return { offline: true }
            }
            toast.error('Erreur lors du téléchargement de la mise à jour')
            return false
        }
    },

    on_download_progress : (callback) => {
        window.localApi.on('update-progress', callback)
    },

    on_update_downloaded : (callback) => {
        window.localApi.on('update-downloaded', callback)
    },

    install_update : async () => {
        try{ return await window.localApi.invoke('install-update')}
        catch {
            toast.error('Erreur lors de l\'installation de la mise à jour')
            return false
        }
    },


}