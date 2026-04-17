import { useState, useEffect } from 'react'
import { Settings, Save, Bell, Database, Download, Shield, AlertTriangle, Calendar, Key } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"
import { parametreService } from '../../services/admin/parametre_service'
import { useForm } from 'react-hook-form'
import { ActivateKeyService } from '../../services/activate-key';
import { getDaysRemaining } from '../../hooks/format_date'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function SettingsPage() {
    
    // GESTION INFORMATION GENERAL
    const [load, setLoad] = useState(false)

    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: { errors: errorsUpdate },
        reset: resetUpdate,
    } = useForm()

    
    useEffect(() => {
        (async () => {
            const res = (await parametreService.getSettings()).data
            resetUpdate({
                name: res?.name,
                email: res?.email,
                phone: res?.phone,
                address: res?.address,
            })
        })()
    },[load])
    
    const handleUpdateSettings = async (data) => {
        const success = await parametreService.updateSettings(data)
        if(success) { 
            setLoad(!load)
        }
    }

    // ==============================================================
    // GESTION DES LICENSES
    const [licenseInfos, setLicenseInfos] = useState([])
    const [laodLicense, setLaodLicense] = useState(false)
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

    // ==============================================================

    const [activeTab, setActiveTab] = useState('general')
    const [openLicenseModal, setOpenLicenseModal] = useState(false)


    const [formData, setFormData] = useState({
        // Paramètres généraux
        nomPharmacie: 'Pharma Plus',
        adresse: '123 Avenue des Pharmaciens, Kinshasa',
        telephone: '+243 123 456 789',
        email: 'contact@pharmaplus.com',
        devise: 'FC',
        langue: 'fr',
        
        // Notifications
        emailNotifications: true,
        stockAlerts: true,
        salesReports: false,
        lowStockThreshold: 10,
        
        // Sécurité
        sessionTimeout: 30,
        passwordMinLength: 8,
        twoFactorAuth: false,
        
        // Apparence
        theme: 'light',
        primaryColor: '#10b981'
    })

    const tabs = [
        { id: 'general', label: 'Général', icon: Settings },
        // { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'license', label: 'Licence', icon: Shield },
        // { id: 'backup', label: 'Sauvegarde', icon: Database },
    ]



    const handleBackup = () => {
        // Logique de sauvegarde
        alert('Sauvegarde créée avec succès!')
    }



    const renderLicenseSettings = () => (
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
    )

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <form method='post' onSubmit={handleSubmitUpdate(handleUpdateSettings)}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de la pharmacie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputLabel 
                        label="Nom de la pharmacie"
                        type='text'
                        {...registerUpdate('name', {
                            required: 'Le nom du produit est obligatoire',
                            minLength: {    
                                value: 2,
                                message: 'Le nom du produit doit contenir au moins 2 caractères'
                            }
                        })}
                        error={!!errorsUpdate.name}
                        helperText={errorsUpdate.name?.message}
                    />
                    <InputLabel 
                        label="Email"
                        type="email"
                        {...registerUpdate('email', {
                            required: 'L\'email est obligatoire',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email invalide'
                            }
                        })}
                        error={!!errorsUpdate.email}
                        helperText={errorsUpdate.email?.message}
                    />
                    <InputLabel 
                        label="Téléphone"
                        type="tel"
                        {...registerUpdate('phone', {
                            required: 'Le téléphone est obligatoire',
                        })}
                        error={!!errorsUpdate.phone}
                        helperText={errorsUpdate.phone?.message}
                    />
                    <div className="md:col-span-2">
                        <InputLabel 
                            label="Adresse"
                            type="text"
                            {...registerUpdate('address', {
                                required: 'L\'adresse est obligatoire',
                            })}
                            error={!!errorsUpdate.address}
                            helperText={errorsUpdate.address?.message}
                        />
                    </div>
                    
                    <Bouton primary type='submit'>
                        <Save className="w-4 h-4" />
                        Sauvegarder
                    </Bouton>
                </div>
            </form>
        </div>
    )

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de notification</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Notifications par email</h4>
                            <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.emailNotifications}
                                onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Alertes de stock</h4>
                            <p className="text-sm text-gray-600">Notifier quand le stock est bas</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.stockAlerts}
                                onChange={(e) => setFormData({...formData, stockAlerts: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seuil d'alerte de stock</label>
                        <input
                            type="number"
                            value={formData.lowStockThreshold}
                            onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                            min="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Notifier quand le stock est inférieur à cette valeur</p>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderBackupSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des sauvegardes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Créer une sauvegarde</h4>
                        <p className="text-sm text-gray-600 mb-4">Sauvegardez toutes vos données et paramètres</p>
                        <Bouton primary onClick={handleBackup} className="w-full">
                            <Download className="w-4 h-4" />
                            Télécharger sauvegarde
                        </Bouton>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Sauvegardes récentes</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">sauvegarde_2024_03_18.json</p>
                                <p className="text-sm text-gray-600">18 Mars 2024 - 14:30</p>
                            </div>
                            <div className="flex gap-2">
                                <Bouton outline className="text-sm">
                                    <Download className="w-4 h-4" />
                                </Bouton>
                                <Bouton outline className="text-sm">
                                    Restaurer
                                </Bouton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderTabContent = () => {
        switch(activeTab) {
            case 'general': return renderGeneralSettings()
            case 'notifications': return renderNotificationSettings()
            case 'license': return renderLicenseSettings()
            case 'backup': return renderBackupSettings()
            default: return renderGeneralSettings()
        }
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
                    <p className="text-sm text-gray-600 mt-1">Configurez votre système</p>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-64">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-slate-100 text-slate-900 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            

            {/* Modal pour activer la licence */}
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
        </div>
    )
}
