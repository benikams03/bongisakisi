import { useState, useEffect } from 'react'
import { Palette, Sun, Moon, Check } from 'lucide-react'
import { Bouton } from '../../../components/ui/bouton'

export const RenderThemeSettings = () => {
    const [darkMode, setDarkMode] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState('emerald')
    const [loading, setLoading] = useState(false)

    const themes = [
        {
            id: 'emerald',
            name: 'Émeraude',
            primary: 'emerald',
            colors: {
                50: '#ecfdf5',
                100: '#d1fae5',
                500: '#10b981',
                600: '#059669',
                700: '#047857'
            },
            preview: 'bg-gradient-to-br from-emerald-500 to-emerald-700'
        },
        {
            id: 'blue',
            name: 'Bleu Océan',
            primary: 'blue',
            colors: {
                50: '#eff6ff',
                100: '#dbeafe',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8'
            },
            preview: 'bg-gradient-to-br from-blue-500 to-blue-700'
        },
        {
            id: 'purple',
            name: 'Violet Royal',
            primary: 'purple',
            colors: {
                50: '#faf5ff',
                100: '#f3e8ff',
                500: '#a855f7',
                600: '#9333ea',
                700: '#7c3aed'
            },
            preview: 'bg-gradient-to-br from-purple-500 to-purple-700'
        },
        {
            id: 'orange',
            name: 'Orange Solaire',
            primary: 'orange',
            colors: {
                50: '#fff7ed',
                100: '#ffedd5',
                500: '#f97316',
                600: '#ea580c',
                700: '#c2410c'
            },
            preview: 'bg-gradient-to-br from-orange-500 to-orange-700'
        },
        {
            id: 'rose',
            name: 'Rose Élégant',
            primary: 'rose',
            colors: {
                50: '#fff1f2',
                100: '#ffe4e6',
                500: '#f43f5e',
                600: '#e11d48',
                700: '#be123c'
            },
            preview: 'bg-gradient-to-br from-rose-500 to-rose-700'
        }
    ]

    const applyTheme = (theme, isDark) => {
        // Appliquer le mode sombre/clair
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        // Appliquer le thème de couleur via CSS variables
        const themeData = themes.find(t => t.id === theme)
        if (themeData) {
            const root = document.documentElement
            root.style.setProperty('--primary-50', themeData.colors[50])
            root.style.setProperty('--primary-100', themeData.colors[100])
            root.style.setProperty('--primary-500', themeData.colors[500])
            root.style.setProperty('--primary-600', themeData.colors[600])
            root.style.setProperty('--primary-700', themeData.colors[700])
        }
    }

    useEffect(() => {
        // Charger les préférences sauvegardées
        const savedTheme = localStorage.getItem('app-theme') || 'emerald'
        const savedDarkMode = localStorage.getItem('app-dark-mode') === 'true'
        
        setSelectedTheme(savedTheme)
        setDarkMode(savedDarkMode)
        applyTheme(savedTheme, savedDarkMode)
    }, [])

    const handleThemeChange = (themeId) => {
        setSelectedTheme(themeId)
        applyTheme(themeId, darkMode)
    }

    const handleDarkModeToggle = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        applyTheme(selectedTheme, newDarkMode)
    }

    const savePreferences = async () => {
        setLoading(true)
        try {
            localStorage.setItem('app-theme', selectedTheme)
            localStorage.setItem('app-dark-mode', darkMode.toString())
            
            // Optionnel: Sauvegarder dans la base de données si nécessaire
            // await parametreService.saveThemeSettings({ theme: selectedTheme, darkMode })
            
            setTimeout(() => setLoading(false), 1000)
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des préférences:', error)
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Mode Sombre/Clair */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mode d'affichage</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Sun className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">Clair</span>
                            </div>
                            <button
                                onClick={handleDarkModeToggle}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                                    darkMode ? 'bg-emerald-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                        darkMode ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                            <div className="flex items-center gap-3">
                                <Moon className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Sombre</span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            {darkMode ? 'Mode sombre activé' : 'Mode clair activé'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thème de Couleur */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thème de couleur</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                            <div
                                key={theme.id}
                                onClick={() => handleThemeChange(theme.id)}
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                    selectedTheme === theme.id
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-gray-900">{theme.name}</span>
                                    </div>
                                    {selectedTheme === theme.id && (
                                        <Check className="w-5 h-5 text-emerald-600" />
                                    )}
                                </div>
                                <div className={`h-16 rounded-lg ${theme.preview}`}></div>
                                <div className="mt-3 flex gap-1">
                                    <div 
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: theme.colors[100] }}
                                    ></div>
                                    <div 
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: theme.colors[500] }}
                                    ></div>
                                    <div 
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: theme.colors[700] }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Aperçu */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center`}>
                                <Palette className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Exemple de bouton</h4>
                                <p className="text-sm text-gray-600">Voici comment apparaissent les éléments avec le thème sélectionné</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Bouton primary>
                                Bouton primaire
                            </Bouton>
                            <Bouton outline>
                                Bouton secondaire
                            </Bouton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Bouton 
                    onClick={savePreferences}
                    load={loading}
                    primary
                    className="px-6"
                >
                    Sauvegarder les préférences
                </Bouton>
            </div>
        </div>
    )
}
