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
                if(res.data?.license?.expires === false) {
                    const response = await window.localApi.invoke('verifyLicense')
                    return response.success;
                }else if(res.data?.license?.expires?.hash !== undefined) {
                    const hostname = await window.localApi.invoke('getOsInfo')
                    const now = Date.now();
                    const checkOne = await window.localApi.invoke('compareHash', hostname.deviceId + res.data.license.expires.start + hostname.deviceId, res.data.license.expires.hash)
                    const checkTwo = now > res.data.license.expires.end
                    const checkThree = Math.round((res.data.license.expires.end - res.data.license.expires.start) / (1000 * 60 * 60 * 24)) === 8

                    if( checkOne && !checkTwo && checkThree ) {
                        // not expired
                        return false
                    } else {
                        // expired
                        return true
                    }
                }else { return true }
            } 
        }
        catch {
            toast.error('Erreur lors de la vérification de la license')
            return false
        }
    }
}
