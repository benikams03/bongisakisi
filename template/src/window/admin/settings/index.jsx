import { useState } from 'react'
import { Settings, Shield, FileText, Lock, Palette, Bell, Upload, Globe, Wrench } from 'lucide-react'
import { RenderGeneralSettings } from './general'
import { RenderLicenseSettings } from './license'
import { RenderExportSettings } from './export'
import { RenderSecuritySettings } from './security'
import { RenderThemeSettings } from './theme'
// import { RenderNotificationSettings } from './notifications'
import { RenderImportSettings } from './import'
// import { RenderRegionalSettings } from './regional'
// import { RenderMaintenanceSettings } from './maintenance'

export default function SettingsPage() {

    const [activeTab, setActiveTab] = useState('general')

    const tabs = [
        { id: 'general', label: 'Général', icon: Settings },
        // { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'theme', label: 'Thème', icon: Palette },
        { id: 'license', label: 'Licence', icon: Shield },
        { id: 'export', label: 'Export', icon: FileText },
        { id: 'security', label: 'Sécurité', icon: Lock },
        { id: 'import', label: 'Import', icon: Upload },
        // { id: 'regional', label: 'Régionalisation', icon: Globe },
        // { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    ]

    const renderTabContent = () => {
        switch(activeTab) {
            case 'general': return <RenderGeneralSettings />
            case 'license': return <RenderLicenseSettings />
            case 'export': return <RenderExportSettings />
            case 'security': return <RenderSecuritySettings />
            case 'theme': return <RenderThemeSettings />
            case 'notifications': return <RenderNotificationSettings />
            case 'import': return <RenderImportSettings />
            // case 'regional': return <RenderRegionalSettings />
            // case 'maintenance': return <RenderMaintenanceSettings />
            default: return <RenderGeneralSettings />
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
                <div className="w-52">
                    <nav className="space-y-1 sticky top-0">
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

            
        </div>
    )
}