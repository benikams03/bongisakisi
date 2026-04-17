import { useState, useEffect } from 'react'
import { Download, Check, Loader, X, RefreshCw, WifiOff } from 'lucide-react'
import { Bouton } from "../ui/bouton/index";
import { updateService } from '../../services/update';

export default function Update({ after }) {
    const [state, setState] = useState('checking') // checking, available, downloading, downloaded, no-update, error, offline
    const [updateInfo, setUpdateInfo] = useState(null)
    const [progress, setProgress] = useState(0)
    const [speed, setSpeed] = useState(0)

    const checkForUpdates = async () => {
        try {
            const result = await updateService.check()
            if (result && result.offline) {
                setState('offline')
            } else if (result && result.version !== '1.3.0') {
                setUpdateInfo(result)
                setState('available')
            } else {
                setState('no-update')
            }
        } catch (error) {
            console.error('Error checking for updates:', error)
            setState('error')
        }
    }

    useEffect(() => {
        (async()=>{ await checkForUpdates() })()
    }, [])

    useEffect(() => {
        // Écouter les événements de progression
        updateService.on_download_progress((data) => {
            setProgress(data.percent)
            setSpeed(data.speed)
        })

        updateService.on_update_downloaded(() => {
            setState('downloaded')
        })

        return () => {
            // Nettoyer les écouteurs d'événements si nécessaire
        }
    }, [])

    const startDownload = async () => {
        setState('downloading')
        try {
            const result = await updateService.start_update()
            if (result && result.error) {
                setState('error')
            }
        } catch (error) {
            console.error('Error starting download:', error)
            setState('error')
        }
    }

    const installUpdate = async () => {
        try {
            await updateService.install_update()
        } catch (error) {
            console.error('Error installing update:', error)
            setState('error')
        }
    }

    const formatSpeed = (bytesPerSecond) => {
        if (bytesPerSecond < 1024) return `${bytesPerSecond} B/s`
        if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`
        return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
    }

    return (
        <div className="w-full py-8 px-18">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-center font-bold text-2xl flex-1">Mise à jour</h1>
                <button
                    onClick={after}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* État: Vérification */}
            {state === 'checking' && (
                <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Vérification des mises à jour...</p>
                </div>
            )}

            {/* État: Mise à jour disponible */}
            {state === 'available' && updateInfo && (
                <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Download className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">
                        Version {updateInfo.version} disponible
                    </p>
                    <p 
                        className="text-sm text-gray-600 mb-6"
                        dangerouslySetInnerHTML={{ 
                            __html: updateInfo.releaseNotes || 'Nouvelles fonctionnalités et corrections de bugs' 
                        }}
                    />
                    
                    <div className="flex gap-3">
                        <Bouton outline
                            onClick={after}
                            className="w-full">
                            Plus tard
                        </Bouton>

                        <Bouton primary
                            onClick={startDownload}
                            className="w-full">
                            <Download className="w-4 h-4" />
                            Télécharger
                        </Bouton>
                    </div>
                </div>
            )}

            {/* État: Téléchargement en cours */}
            {state === 'downloading' && (
                <div className="text-center py-4">
                    <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-4">Téléchargement en cours...</p>
                    
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Téléchargement</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {speed > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                                {formatSpeed(speed)}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* État: Téléchargement terminé */}
            {state === 'downloaded' && (
                <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Téléchargement terminé</p>
                    <p className="text-sm text-gray-600 mb-6">
                        La mise à jour est prête à être installée
                    </p>
                    
                    <div className="flex gap-3">
                        <Bouton outline
                            onClick={after}
                            className="w-full">
                            Plus tard
                        </Bouton>

                        <Bouton primary
                            onClick={installUpdate}
                            className="w-full">
                            Installer maintenant
                        </Bouton>
                    </div>
                </div>
            )}

            {/* État: Pas de mise à jour */}
            {state === 'no-update' && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Vous êtes à jour</p>
                    <p className="text-sm text-gray-600 mb-6">
                        Vous utilisez la dernière version de l'application
                    </p>
                    
                    <div className="flex gap-3">
                        <Bouton outline
                            onClick={checkForUpdates}
                            className="w-full">
                            <RefreshCw className="w-4 h-4" />
                            Vérifier à nouveau
                        </Bouton>

                        <Bouton primary
                            onClick={after}
                            className="w-full">
                            Continuer
                        </Bouton>
                    </div>
                </div>
            )}

            {/* État: Hors connexion */}
            {state === 'offline' && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                        <WifiOff className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Aucune connexion internet</p>
                    <p className="text-sm text-gray-600 mb-6">
                        Veuillez vérifier votre connexion et réessayer
                    </p>
                    
                    <div className="flex gap-3">
                        <Bouton outline
                            onClick={after}
                            className="w-full">
                            Plus tard
                        </Bouton>

                        <Bouton primary
                            onClick={checkForUpdates}
                            className="w-full">
                            <RefreshCw className="w-4 h-4" />
                            Réessayer
                        </Bouton>
                    </div>
                </div>
            )}

            {/* État: Erreur */}
            {state === 'error' && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Erreur de mise à jour</p>
                    <p className="text-sm text-gray-600 mb-6">
                        Une erreur est survenue lors de la mise à jour
                    </p>
                    
                    <div className="flex gap-3">
                        <Bouton outline
                            onClick={checkForUpdates}
                            className="w-full">
                            <RefreshCw className="w-4 h-4" />
                            Réessayer
                        </Bouton>

                        <Bouton primary
                            onClick={after}
                            className="w-full">
                            Continuer
                        </Bouton>
                    </div>
                </div>
            )}
        </div>
    )
}