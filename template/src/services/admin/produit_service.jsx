import toast from "react-hot-toast"

export const produitService = {

    get : async () => {
        try{ return await window.localApi.invoke('getProduits') }
        catch {
            toast.error('Erreur lors de la récupération des produits')
            return null
        }
    },

    add : async (data) => {
        try{ 
            const result = await window.localApi.invoke('addProduit', data)
            if(result.success) {
                toast.success('Produit ajouté avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de l\'ajout du produit')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de l\'ajout de la famille personnalisée')
            return false
        }
    },

    update : async (data, id) => {
        try{ 
            const result = await window.localApi.invoke('updateProduit', data, id)
            if(result.success) {
                toast.success('Produit modifié avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la modification du produit')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la modification du produit')
            return false
        }
    },
    
    delete : async (id) => {
        try{ 
            const result = await window.localApi.invoke('deleteProduit', id)
            if(result.success) {
                toast.success('Produit supprimé avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la suppression du produit')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la suppression du produit')
            return false
        }
    },
    
}