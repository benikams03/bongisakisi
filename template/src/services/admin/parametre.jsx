import toast from "react-hot-toast"

export const parametreService = {

    getSettings: async () => {
        try{ return await window.localApi.invoke('getSettings') }
        catch {
            toast.error('Erreur lors de la récupération des paramètres')
            return null
        }
    }

}