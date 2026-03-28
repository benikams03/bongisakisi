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
    
}