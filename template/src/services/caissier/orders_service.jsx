import toast from "react-hot-toast"

export const ordersService = {

    get : async () => {
        try{ return await window.localApi.invoke('getPanier') }
        catch {
            toast.error('Erreur lors de la récupération du panier')
            return null
        }
    },

    add : async (data) => {
        try{ 
            const result = await window.localApi.invoke('addPanier', data)
            if(result.success) {
                toast.success('Panier ajouté avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de l\'ajout du panier')
                return false
            }
        }
        catch(e) {
            toast.error('Erreur lors de l\'ajout du panier')
            return false
        }
    },

    remove : async (data) => {
        try{ 
            const result = await window.localApi.invoke('removePanier', data)
            if(result.success) {
                toast.success('Panier supprimé avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la suppression du panier')
                return false
            }
        }
        catch(e) {
            toast.error('Erreur lors de la suppression du panier')
            return false
        }
    },

    removeDirect : async (data) => {
        try{ 
            const result = await window.localApi.invoke('removePanierDirect', data)
            if(result.success) {
                toast.success('Panier supprimé avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la suppression du panier')
                return false
            }
        }
        catch(e) {
            toast.error('Erreur lors de la suppression du panier')
            return false
        }
    },

    confirmPanier : async () => {
        try{ 
            const result = await window.localApi.invoke('confirmPanier')
            if(result.success) {
                toast.success('Panier confirmé avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la confirmation du panier')
                return false
            }
        }
        catch(e) {
            toast.error('Erreur lors de l\'ajout du panier')
            return false
        }
    }

}