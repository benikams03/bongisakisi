import toast from "react-hot-toast"

export const rapportService = {

    getRapport : async () => {
        try{ return (await window.localApi.invoke('getStatCaissier')).data }
        catch {
            toast.error('Erreur lors de la récupération des statistiques')
            return null
        }
    },
    
    getStatDashbord : async (choix) => {
        try{ return (await window.localApi.invoke('getStatDashbord', choix)) }
        catch {
            toast.error('Erreur lors de la récupération des statistiques')
            return null
        }
    },

    getLowStockItems : async () => {
        try{ return (await window.localApi.invoke('getLowStockItems')).data }
        catch {
            toast.error('Erreur lors de la récupération des stocks faibles')
            return null
        }
    },

    getExpiredItems : async () => {
        try{ return (await window.localApi.invoke('getExpiredItems')).data }
        catch {
            toast.error('Erreur lors de la récupération des médicaments expirés')
            return null
        }
    },

}