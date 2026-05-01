import toast from "react-hot-toast"

export const imprimantService = {

    print : async (data) => {
        try{ 
            const res = await window.localApi.invoke('print', data) 
            if(res.success) {
                toast.success('Impression effectuée avec succès')
                return true
            }else{
                toast.error(res.error || 'Erreur lors de l\'impression')
                return false
            }
        }
        catch {
            toast.error('Erreur lors de l\'impression')
            return false
        }
    },

}