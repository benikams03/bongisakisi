import { useState, useEffect } from 'react'
import { Settings, Save, Bell, Database, Download, Shield, AlertTriangle, Calendar, Key, FileText } from 'lucide-react'
import { Bouton } from '../../../components/ui/bouton'
import { InputLabel } from '../../../components/ui/input'
import Modal from "@mui/material/Modal"
import { parametreService } from '../../../services/admin/parametre_service'
import { useForm } from 'react-hook-form'
import { ActivateKeyService } from '../../../services/activate-key';
import { getDaysRemaining } from '../../../hooks/format_date'
import axios from 'axios'
import toast from 'react-hot-toast'

export const RenderLicenseSettings = () => {
    const [licenseInfos, setLicenseInfos] = useState([])
    const [laodLicense, setLaodLicense] = useState(false)
    const [openLicenseModal, setOpenLicenseModal] = useState(false)
    
    useEffect(()=>{
        (async ()=>{
            const res_key = (await ActivateKeyService.get()).data
            setLicenseInfos(res_key)
        })()
    },[laodLicense])

    
    const {
        register: registerKey,
        handleSubmit: handleSubmitKey,
        formState: { errors: errorsKey },
        reset: resetKey,
        setValue: setValueKey,
    } = useForm()
    
    const handleChange = (e) => {
        let v = e.target.value.replace(/-/g, "").toUpperCase();
        let formatted = v.match(/.{1,4}/g)?.join("-") || "";
        setValueKey("key",formatted);
    };

    const [laodkey, setLaodkey] = useState(false)
    const handleKey = async (data) => {
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
                resetKey()
                setLaodLicense(!laodLicense)
                setOpenLicenseModal(false)
                toast.success("Licence activée avec succès")
            } else{ 
                toast.error(res.data.msg)
            }
        } catch(er) {
            toast.error(er.message)
        }
        finally{
            setLaodkey(false)
        }
    }
    
    return (<>
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État de la licence</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            { licenseInfos?.expired?.isInfinity ?
                                <>
                                    <Shield className="w-5 h-5" />
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100`}>
                                        Active
                                    </span>
                                </>: 
                                <>
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100`}>
                                        Non active
                                    </span>
                                </>
                            }
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">
                            {licenseInfos?.expired?.isInfinity ? 'Premium' : 'Trial'}
                        </h4>
                        <p className="text-sm text-gray-600">Clé: {licenseInfos?.key || 'XXXX-XXXX-XXXX-XXXX'}</p>
                    </div>
                    <div className="text-right">
                        { !licenseInfos?.expired?.isInfinity &&
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                    <span>Expire le: {licenseInfos?.expired?.date}</span>
                            </div>
                        }
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            { licenseInfos?.expired?.isInfinity ? 'Illimitée' : `${getDaysRemaining(licenseInfos?.expired?.date)} jours`}
                        </p>
                    </div>
                </div>
                
                { !licenseInfos?.expired?.isInfinity && (
                    <div className="mt-4">
                        <Bouton primary onClick={() => setOpenLicenseModal(true)}>
                            <Key className="w-4 h-4" />
                            Activer une nouvelle licence
                        </Bouton>
                    </div>
                )}
            </div>
        </div>
    </div>
    
    
    <Modal open={openLicenseModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
        <form method='post' onSubmit={handleSubmitKey(handleKey)} className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Activer une nouvelle licence</h2>
            
            <div className="space-y-4">
                <InputLabel 
                    label="Code de licence"
                    placeholder="Entrez votre code de licence..."
                    maxLength={19}
                    {...registerKey("key", { 
                        required: 'Le code de licence est requis',
                        onChange: handleChange
                    })}
                    error={!!errorsKey.key} 
                    helperText={errorsKey.key?.message}
                />
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Veuillez entrer votre code de licence.
                        <br />
                        Format attendu: XXXX-XXXX-XXXX-XXXX
                    </p>
                </div>
            </div>
            
            <div className="flex gap-2 mt-6">
                <Bouton load={laodkey}
                    primary className="flex-1" type="submit">
                    <Key className="w-4 h-4" />
                    Activer
                </Bouton>
                <Bouton outline className="flex-1" 
                    onClick={() => {
                        setOpenLicenseModal(false)
                        resetKey()
                    }} 
                    type='cancel'>
                    Annuler
                </Bouton>
            </div>
        </form>
    </Modal>
    </>)
}