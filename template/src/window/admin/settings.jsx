import { useState, useEffect } from 'react'
import { Settings, Save, Bell, Database, Download, Shield, AlertTriangle, Calendar, Key, FileText } from 'lucide-react'
import { Bouton } from '../../components/ui/bouton'
import { InputLabel } from '../../components/ui/input'
import Modal from "@mui/material/Modal"
import { parametreService } from '../../services/admin/parametre_service'
import { useForm } from 'react-hook-form'
import { ActivateKeyService } from '../../services/activate-key';
import { getDaysRemaining } from '../../hooks/format_date'
import axios from 'axios'
import toast from 'react-hot-toast'

// Importer l'API Electron pour le dialogue de sélection de dossier
let electronAPI = null;

try {
    // Utiliser le contextBridge exposé par le preload script
    electronAPI = window.localApi;
} catch (error) {
    console.error('Electron API non disponible:', error);
    // Fallback pour le développement web
}



    
export default function SettingsPage() {
    
    // GESTION INFORMATION GENERAL
    const [load, setLoad] = useState(false)
    
    // État pour les paramètres
    const [formData, setFormData] = useState({
        // Paramètres généraux
        name: '',
        email: '',
        phone: '',
        address: '',
        nomPharmacie: 'Pharma Plus',
        telephone: '+243 812 345 678',
        
        // Notifications
        lowStockAlerts: true,
        salesReports: false,
        lowStockThreshold: 10,
        emailNotifications: true,
        stockAlerts: true,
        
        // Sécurité
        sessionTimeout: 30,
        passwordMinLength: 8,
        twoFactorAuth: false,
        
        // Apparence
        theme: 'light',
        primaryColor: '#10b981',
        
        // Exportation PDF
        pdfExportPath: 'C:\\Users\\benik\\Documents\\01_PROJETS\\PERSO\\05_BongisaKisi\\bongisakisi\\app',
        pdfAutoOpen: true,
        pdfIncludeCharts: true,
        pdfIncludeDetails: true,
        pdfFormat: 'A4',
        pdfOrientation: 'portrait'
    })
    
    // Charger les paramètres PDF depuis electron-store au démarrage
    useEffect(() => {
        const loadPdfSettings = async () => {
            try {
                if (electronAPI) {
                    const settings = await electronAPI.invoke('get-pdf-export-settings');
                    setFormData(prevData => ({
                        ...prevData,
                        ...settings
                    }));
                }
            } catch (error) {
                console.error('Erreur lors du chargement des paramètres PDF:', error);
            }
        };
        
        loadPdfSettings();
    }, []);

    // Sauvegarder automatiquement les paramètres PDF lorsqu'ils changent
    useEffect(() => {
        const saveAllPdfSettings = async () => {
            const pdfSettings = {
                pdfExportPath: formData.pdfExportPath,
                pdfAutoOpen: formData.pdfAutoOpen,
                pdfIncludeCharts: formData.pdfIncludeCharts,
                pdfIncludeDetails: formData.pdfIncludeDetails,
                pdfFormat: formData.pdfFormat,
                pdfOrientation: formData.pdfOrientation
            };
            
            await savePdfSettings(pdfSettings);
        };
        
        // Délai pour éviter les sauvegardes multiples
        const timeoutId = setTimeout(saveAllPdfSettings, 1000);
        
        return () => clearTimeout(timeoutId);
    }, [
        formData.pdfExportPath,
        formData.pdfAutoOpen,
        formData.pdfIncludeCharts,
        formData.pdfIncludeDetails,
        formData.pdfFormat,
        formData.pdfOrientation
    ]);

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

    const tabs = [
        { id: 'general', label: 'Général', icon: Settings },
        // { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'license', label: 'Licence', icon: Shield },
        { id: 'export', label: 'Export PDF', icon: FileText },
        // { id: 'backup', label: 'Sauvegarde', icon: Database },
    ]



    const handleBackup = () => {
        // Logique de sauvegarde
        alert('Sauvegarde créée avec succès!')
    }


    // =============================================================================
    const savePdfSettings = async (settings) => {
        try {
            if (electronAPI) {
                await electronAPI.invoke('save-pdf-export-settings', settings);
                console.log('Paramètres PDF sauvegardés:', settings);
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres PDF:', error);
            toast.error('Erreur lors de la sauvegarde des paramètres');
        }
    };

    const handleBrowseFolder = async () => {
        try {
            // Vérifier si l'API Electron est disponible
            if (!electronAPI) {
                toast.error('Fonctionnalité non disponible dans le navigateur web')
                return
            }
            
            // Utiliser l'API Electron pour ouvrir le dialogue de sélection de dossier
            const result = await electronAPI.invoke('open-folder-dialog')
            
            if (result && !result.canceled) {
                // Mettre à jour le chemin sélectionné
                const newSettings = {
                    ...formData,
                    pdfExportPath: result.filePaths[0]
                };
                
                setFormData(newSettings);
                
                // Sauvegarder automatiquement dans electron-store
                await savePdfSettings(newSettings);
                
                // Afficher un message de confirmation
                toast.success('Dossier sélectionné et sauvegardé avec succès')
            }
        } catch (error) {
            console.error('Erreur lors de la sélection du dossier:', error)
            toast.error('Erreur lors de la sélection du dossier')
        }
    }
    // =============================================================================



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

    const renderExportSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres d'exportation PDF</h3>
                <div className="space-y-6">
                    {/* Emplacement d'exportation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emplacement d'exportation des fichiers PDF
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.pdfExportPath}
                                onChange={(e) => setFormData({...formData, pdfExportPath: e.target.value})}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                placeholder="Ex: C:\Users\benik\Documents\Exports"
                            />
                            <Bouton outline onClick={handleBrowseFolder}>
                                Parcourir
                            </Bouton>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Dossier où les fichiers PDF générés seront enregistrés
                        </p>
                    </div>

                    {/* Options d'exportation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Ouvrir automatiquement</p>
                                    <p className="text-sm text-gray-600">Ouvrir le PDF après génération</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.pdfAutoOpen}
                                        onChange={(e) => setFormData({...formData, pdfAutoOpen: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Inclure les graphiques</p>
                                    <p className="text-sm text-gray-600">Ajouter les graphiques dans le PDF</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.pdfIncludeCharts}
                                        onChange={(e) => setFormData({...formData, pdfIncludeCharts: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Inclure les détails</p>
                                    <p className="text-sm text-gray-600">Ajouter les tableaux détaillés</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.pdfIncludeDetails}
                                        onChange={(e) => setFormData({...formData, pdfIncludeDetails: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Format de page
                                </label>
                                <select
                                    value={formData.pdfFormat}
                                    onChange={(e) => setFormData({...formData, pdfFormat: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    <option value="A4">A4</option>
                                    <option value="A3">A3</option>
                                    <option value="Letter">Letter</option>
                                    <option value="Legal">Legal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Orientation
                                </label>
                                <select
                                    value={formData.pdfOrientation}
                                    onChange={(e) => setFormData({...formData, pdfOrientation: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    <option value="portrait">Portrait</option>
                                    <option value="landscape">Paysage</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bouton de test */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Testez vos paramètres en générant un exemple de PDF
                                </p>
                            </div>
                            <Bouton primary>
                                <FileText className="w-4 h-4" />
                                Générer un PDF test
                            </Bouton>
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
            case 'export': return renderExportSettings()
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
