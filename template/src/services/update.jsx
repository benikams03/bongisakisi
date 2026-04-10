import toast from 'react-hot-toast'

export const updateService = {

    check : async () => {
        try{ return await window.localApi.invoke('check-update')}
        catch {
            toast.error('Erreur lors de l\'ajout de l\'acquisition')
            return false
        }
    },

    start_update : async () => {
        try{ 
            let percent
            await window.localApi.invoke('start-update', (data)=>{
                percent = data.percent
            })
            return percent
        }
        catch {
            toast.error('Erreur lors de l\'ajout de l\'acquisition')
            return false
        }
    },

    download_progress : async () => {
        try{ return await window.localApi.on('download-progress', ()=>{
            true
        })}
        catch {
            toast.error('Erreur lors de l\'ajout de l\'acquisition')
            return false
        }
    },

    install_update : async () => {
        try{ return await window.localApi.invoke('install-update')}
        catch {
            toast.error('Erreur lors de l\'ajout de l\'acquisition')
            return false
        }
    },


}