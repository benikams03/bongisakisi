import toast from "react-hot-toast"

export const parametreService = {

    getSettings: async () => {
        try{ return await window.localApi.invoke('getSettings') }
        catch {
            toast.error('Erreur lors de la récupération des paramètres')
            return null
        }
    },

    updateSettings: async (settings) => {
        try{ 
            const res = await window.localApi.invoke('updateSettings', settings)
            if(!res.success) {
                toast.error(res.error)
                return null
            }
            toast.success('Paramètres mis à jour avec succès')
            return res
        }
        catch {
            toast.error('Erreur lors de la mise à jour des paramètres')
            return null
        }
    },

}