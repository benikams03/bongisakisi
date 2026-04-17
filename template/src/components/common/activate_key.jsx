import Modal from "@mui/material/Modal"
import { InputLabel } from "../ui/input"
import { Bouton } from "../ui/bouton"
import { Key } from "lucide-react"
import { ActivateKeyService } from "../../services/activate-key"
import { useForm } from "react-hook-form"
import axios from "axios"
import { parametreService } from "../../services/admin/parametre_service"
import { toast } from "react-hot-toast"
import { useState } from "react"


export default function ActivateKey({ open, setOpen, isExpired }){
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    
    const [laodkey, setLaodkey] = useState(false)
    const handle = async (data) => {
        setLaodkey(true)
        try {
            const getInfo = (await parametreService.getSettings()).data
            const hostname = await window.localApi.invoke('getOsInfo')

            const res = await axios.post("https://bongisakisi-admin-web.onrender.com/api/v1/register", {
                key: data.key,
                name_pc: hostname.nom,
                name_pharmacie: getInfo?.name,
                email: getInfo?.email,
                phone: getInfo?.phone,
                localisation: getInfo?.address
            })

            if (res.data.success) {
                await ActivateKeyService.set({
                    key: data.key,
                    isInfinity: true
                })
                setOpen(false)
                toast.success("Licence activée avec succès")
            } else{ 
                toast.error(res.data.msg)
            }
        } catch(er) {
            toast.error(er.message)
        } finally{
            setLaodkey(false)
        }
    }

    const handleFree = async () => {
        await ActivateKeyService.set({
            isInfinity: false
        })
        setOpen(false)
    }

    const handleChange = (e) => {
        let v = e.target.value.replace(/-/g, "").toUpperCase();
        let formatted = v.match(/.{1,4}/g)?.join("-") || "";
        setValue("key", formatted);
    };
    
    return(<>
    <Modal open={open} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
        <form method="post" onSubmit={handleSubmit(handle)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Activation de la licence</h2>

            {isExpired && (
            <p className="text-sm text-red-600 mb-4">
                Votre essai gratuit de 8 jours est terminé.
            </p>)}
            
            <div className="space-y-4">
                <InputLabel 
                    label="Code de licence"
                    placeholder="Entrez votre code de licence..."
                    {...register("key", { 
                        required: 'Le code de licence est requis',
                        onChange: handleChange
                    })}
                    maxLength={19}
                    error={!!errors.key} 
                    helperText={errors.key?.message}
                />
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Veuillez entrer votre code de licence.
                        <br />
                        Format attendu: XXXX-XXXX-XXXX-XXXX
                    </p>
                    
                    { !isExpired &&    
                    <p className="text-sm text-gray-600">
                        <br />
                        Sinon vous pouvez utiliser l'essai gratuit de 8 jours.
                    </p> }
                </div>
            </div>
            
            { !isExpired &&
            <div className="flex gap-2 mt-6">
                <Bouton load={laodkey} primary className="flex-1" type="submit">
                    <Key className="w-4 h-4" />
                    Activer
                </Bouton>
                
                <Bouton outline className="flex-1" onClick={handleFree}>
                    Activer l’essai gratuit
                </Bouton>
            </div> }
            
            { isExpired &&
            <div className="flex gap-1 mt-6">
                <Bouton load={laodkey} primary className="flex-1" type="submit">
                    <Key className="w-4 h-4" />
                    Activer
                </Bouton>
            </div> }
        </form>
    </Modal>

    </>)
}