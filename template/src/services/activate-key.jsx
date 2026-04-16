import toast from 'react-hot-toast'

export const ActivateKeyService = {

    get : async () => {
        try {
            return await window.localApi.invoke('getActivate')
        }
        catch {
            toast.error('Erreur lors de la vérification de la license')
            return false
        }
    },

    set : async (data) => {
        try {
            const result = await window.localApi.invoke('createActive', data)
            if(result.success) {
                toast.success('Clé de licence ajoutée avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de l\'ajout de la clé de licence')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la vérification de la license')
            return false
        }
    },

    check : async () => {
        try {
            const res = await window.localApi.invoke('getActivate')
            if(res.success) {
                if(!res.data.expired.isInfinity) {
                    const target = res.data.expired.date;
                    const today = new Date().toISOString().split("T")[0];

                    if( today > target ) {
                        // expired
                        return true
                    } else {
                        // not expired
                        return false
                    }
                }else {
                    console.log('online');
                    // faire une verification online
                }
            } 
        }
        catch {
            toast.error('Erreur lors de la vérification de la license')
            return false
        }
    }
}
