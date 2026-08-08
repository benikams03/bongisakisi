import toast from "react-hot-toast"

export const clientService = {

    getClients : async () => {
        try{ 
            const result = await window.localApi.invoke('getClients')
            if(result.success) {
                return result.data
            }else{
                toast.error(result.error || 'Erreur lors de la récupération des clients')
                return []
            }
        }
        catch(e) {
            toast.error('Erreur lors de la récupération des clients')
            return []
        }
    },

    getClientCommands : async (clientId) => {
        try{ 
            const result = await window.localApi.invoke('getClientCommands', clientId)
            if(result.success) {
                return result.data
            }else{
                toast.error(result.error || 'Erreur lors de la récupération des commandes')
                return []
            }
        }
        catch(e) {
            toast.error('Erreur lors de la récupération des commandes')
            return []
        }
    },

    validateDebtPayment : async (panierId) => {
        try{ 
            const result = await window.localApi.invoke('validateDebtPayment', { panierId })
            if(result.success) {
                toast.success(result.message || 'Paiement validé avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la validation du paiement')
                return false
            }
        }
        catch(e) {
            toast.error('Erreur lors de la validation du paiement')
            return false
        }
    }
}
