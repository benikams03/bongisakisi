import toast from "react-hot-toast"

export const fournisseurService = {

    get : async () => {
        try{ 
            const result = await window.localApi.invoke('getFournisseurs')
            if(result.success) {
                return result.data
            }else{
                toast.error(result.error || 'Erreur lors de la récupération des fournisseurs')
                return null
            }
        }
        catch {
            toast.error('Erreur lors de la récupération des fournisseurs')
            return null
        }
    },

    add : async (data) => {
        try{ 
            const result = await window.localApi.invoke('addFournisseur', data)
            if(result.success) {
                toast.success('Fournisseur ajouté avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de l\'ajout du fournisseur')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de l\'ajout du fournisseur')
            return false
        }
    },

    update : async (data) => {
        try{ 
            const result = await window.localApi.invoke('updateFournisseur', data)
            if(result.success) {
                toast.success('Fournisseur mis à jour avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la mise à jour du fournisseur')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la mise à jour du fournisseur')
            return false
        }
    },

    delete : async (id) => {
        try{ 
            const result = await window.localApi.invoke('deleteFournisseur', id)
            if(result.success) {
                toast.success('Fournisseur supprimé avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la suppression du fournisseur')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la suppression du fournisseur')
            return false
        }
    },

}
