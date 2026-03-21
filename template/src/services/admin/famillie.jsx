import toast from "react-hot-toast"

export const famillieService = {

    getDefault : async () => {
        try{ return await window.localApi.invoke('getDefaultFamille') }
        catch {
            toast.error('Erreur lors de la récupération de la famille par défaut')
            return null
        }
    }

}