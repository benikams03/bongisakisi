import toast from "react-hot-toast"

export const parametreService = {

    getSettings: async () => {
        try{ return await window.localApi.invoke('getSettings') }
        catch {
            toast.error('Erreur lors de la récupération des paramètres')
            return null
        }
    },

    updateSettings: async (settings) => {
        try{ 
            const res = await window.localApi.invoke('updateSettings', settings)
            if(!res.success) {
                toast.error(res.error)
                return null
            }
            toast.success('Paramètres mis à jour avec succès')
            return res
        }
        catch {
            toast.error('Erreur lors de la mise à jour des paramètres')
            return null
        }
    },

    openFolderDialog: async () => {
        try{
            const res = await window.localApi.invoke('open-folder-dialog')
            if (res && !res.canceled) {
                return res.filePaths[0]
            }
            return null
        }
        catch {
            toast.error('Erreur lors de l\'ouverture du dialogue de sélection de dossier')
            return null
        }
    },

    savePdfSettings: async (settings) => {
        try {
            await window.localApi.invoke('save-pdf-export-settings', settings);
            toast.success('Paramètres PDF sauvegardés avec succès');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres PDF:', error);
            toast.error('Erreur lors de la sauvegarde des paramètres');
        }
    },

    getPdfSettings: async () => {
        try {
            const result = await window.localApi.invoke('get-pdf-export-settings');
            if (!result.success) {
                toast.error(result.error);
                return null;
            }
            return result.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres PDF:', error);
            toast.error('Erreur lors de la récupération des paramètres');
            return null;
        }
    }

}