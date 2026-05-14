import { useContext } from 'react'
import { Palette, Check } from 'lucide-react'
import { themes } from '../../../constant/themes'
import { ThemeContext } from '../../../router/provider'

export const RenderThemeSettings = () => {
    
    const { color, changeColor } = useContext(ThemeContext)

    return (
        <div className="space-y-4">

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thème de couleur</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                            <div
                                onClick={ () => changeColor(theme) }
                                key={theme.id}
                                className={`relative cursor-pointer rounded-lg border-1 px-4 py-3 transition-all border-gray-200 bg-white hover:border-gray-300
                                    ${ color.id === theme.id ? '!border-emerald-400' :'' }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-sm text-gray-900">{theme.name}</span>
                                    </div>
                                    { color.id === theme.id && <Check className="w-5 h-5 text-emerald-600" /> }
                                </div>
                                <div className={`h-12 rounded-lg border border-gray-200 ${theme.preview}`}></div>
                               
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}
