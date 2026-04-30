import toast from "react-hot-toast"

export const exportService = {

    get : async (type, date) => {
        try{ 
            const result = await window.localApi.invoke('getExport', type, date)
            if(result.success) {
                // toast.success('Export effectué avec succès')
                return result.data
            }else{
                toast.error(result.error || 'Erreur lors de l\'export')
                return []
            }
        }
        catch {
            toast.error('Erreur lors de l\'export')
            return []
        }
    },
    getBy : async (type, date) => {
        try{ 
            const result = await window.localApi.invoke('getExportBy', type, date)
            if(result.success) {
                // toast.success('Export effectué avec succès')
                return result.data
            }else{
                toast.error(result.error || 'Erreur lors de l\'export')
                return []
            }
        }
        catch {
            toast.error('Erreur lors de l\'export')
            return []
        }
    },

    exportPdf : async (data,type) => {
        try{ 
            const result = await window.localApi.invoke('exportPdf', data, type)
            if(result.success) {
                toast.success('Export effectué avec succès')
                return result.data
            }else{
                toast.error(result.error || 'Erreur lors de l\'export')
                return []
            }
        }
        catch {
            toast.error('Erreur lors de l\'export')
            return []
        }
    }

}