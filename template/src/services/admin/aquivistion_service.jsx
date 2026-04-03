import toast from "react-hot-toast"

export const aquisitionService = {

    add : async (data) => {
        try{ 
            const result = await window.localApi.invoke('addAcquisition', data)
            if(result.success) {
                toast.success('Acquisition ajoutée avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de l\'ajout de l\'acquisition')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de l\'ajout de l\'acquisition')
            return false
        }
    },

    validate : async (id) => {
        try{ 
            const result = await window.localApi.invoke('validateAcquisition', id)
            if(result.success) {
                toast.success('Acquisition validée avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la validation de l\'acquisition')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la validation de l\'acquisition')
            return false
        }
    },

    delete : async (id) => {
        try{ 
            const result = await window.localApi.invoke('deleteAcquisition', id)
            if(result.success) {
                toast.success('Acquisition supprimée avec succès')
                return true
            }else{
                toast.error(result.error || 'Erreur lors de la suppression de l\'acquisition')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de la suppression de l\'acquisition')
            return false
        }
    }
    
}