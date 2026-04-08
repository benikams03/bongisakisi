import toast from "react-hot-toast"

export const rapportService = {

    getRapport : async () => {
        try{ return (await window.localApi.invoke('getStatCaissier')).data }
        catch {
            toast.error('Erreur lors de la récupération des statistiques')
            return null
        }
    },

}