import toast from "react-hot-toast"

export const famillieService = {

    getDefault : async () => {
        try{ return await window.localApi.invoke('getDefaultFamille') }
        catch {
            toast.error('Erreur lors de la récupération de la famille par défaut')
            return null
        }
    },

    getCustom : async () => {
        try{ return await window.localApi.invoke('getCustomFamilles') }
        catch {
            toast.error('Erreur lors de la récupération des familles personnalisées')
            return null
        }
    },

    addCustom : async (data) => {
        try{ 
            const result = await window.localApi.invoke('addCustomFamille', data)
            if(result.success) {
                toast.success('Famille personnalisée ajoutée avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de l\'ajout de la famille personnalisée')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de l\'ajout de la famille personnalisée')
            return false
        }
    },
    
    updateCustom : async (data) => {
        try{ 
            const result = await window.localApi.invoke('updateCustomFamille', data)
            console.log(result);
            
            if(result.success) {
                toast.success('Famille personnalisée modifiée avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la modification de la famille personnalisée')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la modification de la famille personnalisée')
            return false
        }
    },

    deleteCustom : async (data) => {
        try{ 
            const result = await window.localApi.invoke('deleteCustomFamille', data)
            if(result.success) {
                toast.success('Famille personnalisée supprimée avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la suppression de la famille personnalisée')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la suppression de la famille personnalisée')
            return false
        }
    }

}