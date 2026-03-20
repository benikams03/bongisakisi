import { useState, useEffect } from 'react'
import { User, UserCheck, Plus, Crown, ChevronRight, Package, Download, AlertCircle, Check, X } from 'lucide-react'
import { Bouton } from '../components/ui/bouton/index'
import Update from '../components/common/update';
import OnboardingModal from '../components/common/onboarding';
import Drawer from "@mui/material/Drawer";
import { Link } from 'react-router-dom';

export default function SelectProfil() {
    const [selectedProfile, setSelectedProfile] = useState(null)
    const [open, setOpen] = useState(false)
    const [showOnboarding, setShowOnboarding] = useState(false)

    // Vérifier si c'est un nouvel utilisateur au chargement du composant
    useEffect(() => {
        const checkFirstTimeUser = () => {
            const hasCompletedOnboarding = localStorage.getItem('bongisakisi_onboarding_completed')
            if (!hasCompletedOnboarding) {
                // Nouvel utilisateur, afficher l'onboarding après un court délai
                setTimeout(() => {
                    setShowOnboarding(true)
                }, 1000)
            }
        }
        
        checkFirstTimeUser()
    }, [])

    const profiles = [
        {
            id: 'admin',
            title: 'Administrateur',
            description: 'Accès complet à l\'administration du système',
            icon: Crown,
            color: 'from-purple-500 to-purple-600',
            link: '/admin/dashboard'
        },
        {
            id: 'caissier',
            title: 'Caissier',
            description: 'Gestion des ventes et des transactions',
            icon: User,
            color: 'from-green-500 to-green-600',
            link: '/caissier/home'
        }
    ]

    const handleProfileSelect = (profile) => {
        setSelectedProfile(profile.id)
        // Ici vous pouvez ajouter la logique de redirection
        console.log(`Profil sélectionné: ${profile.title}`)
    }

    const handleOnboardingComplete = (pharmacyData) => {
        // Sauvegarder les informations de la pharmacie
        localStorage.setItem('bongisakisi_pharmacy_info', JSON.stringify(pharmacyData))
        localStorage.setItem('bongisakisi_onboarding_completed', 'true')
        setShowOnboarding(false)
        console.log('Configuration terminée:', pharmacyData)
    }

    return (<>
        <div className="bg-[url('./../assets/wavy-lines.svg')] bg-cover bg-center h-screen flex items-center justify-center p-4">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Bongisa
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-slate-500">Kisi</span>
                    </h1>
                    <p className="text-sm text-gray-500">Sélectionnez votre profil pour continuer</p>
                </div>

                {/* Grille des profils */}
                <div className="flex justify-center gap-3">
                    {profiles.map((profile) => {
                        const Icon = profile.icon
                        const isSelected = selectedProfile === profile.id
                        
                        return (
                            <button
                                key={profile.id}
                                onClick={() => handleProfileSelect(profile)}
                                className={`
                                    relative p-6 rounded-2xl border-1 transition-all duration-200 w-1/5
                                    ${isSelected 
                                        ? 'border-emerald-500 bg-white shadow-lg scale-105' 
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                    }
                                    group cursor-pointer
                                `}
                            >
                                {/* Icône */}
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center mb-4
                                    bg-gradient-to-br ${profile.color}
                                    transition-all duration-200
                                `}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>

                                {/* Contenu */}
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {profile.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {profile.description}
                                    </p>
                                </div>

                                {/* Indicateur de sélection */}
                                {isSelected && (
                                    <div className="absolute top-4 right-4 w-7 h-7 bg-gray-500 rounded-lg flex items-center justify-center">
                                        <UserCheck className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                { isSelected && (
                                <Link to={profile.link} className="mt-8 flex text-center">
                                    <Bouton
                                        onClick={() => console.log('Redirection vers le dashboard')}
                                        className="w-full"
                                        primary>
                                        Continuer
                                        <ChevronRight className="w-5 h-5" />
                                    </Bouton>
                                </Link> ) }
                            </button>
                        )
                    })}
                    
                    {/* Card pour créer un nouveau profil */}
                    <button
                        onClick={() => console.log('Créer un nouveau profil')}
                        className="relative p-6 rounded-2xl border-1 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 group cursor-pointer w-1/5"
                    >
                        {/* Icône + */}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gray-200 group-hover:bg-gray-300 transition-colors duration-200">
                            <Plus className="w-5 h-5 text-gray-600" />
                        </div>

                        {/* Contenu */}
                        <div className="text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Nouveau Profil
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Créer un profil personnalisé pour vos besoins spécifiques
                            </p>
                        </div>

                        <div className="mt-8 text-center">
                            <Bouton 
                                onClick={() => console.log('Redirection vers le dashboard')}
                                className="w-full">
                                Continuer
                                <ChevronRight className="w-5 h-5" />
                            </Bouton>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>Version 2.1.0</span>
                        <span className="text-gray-400">•</span>
                        <span>Build 2024.03.19</span>
                    </div>
                    <p>&copy; 2026 BongisaKisi - Solution de gestion pharmacetique</p>
                    <div className="mt-4 flex justify-center">
                        <Bouton outline
                            onClick={() => setOpen(true)}>
                            <Download className="w-4 h-4 text-gray-600" />
                            <span className="">Mise à jour</span>
                        </Bouton>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Modal de mise à jour */}
        <Drawer
            anchor="bottom"
            open={open}
            onClose={ () => setOpen(false)}
            PaperProps={{
                className: "bg-white shadow border border-gray-200 rounded-t-2xl text-black w-2/5 mx-auto"
            }}>
                <Update after={() => setOpen(false)} />
        </Drawer>

        {/* Modal d'onboarding pour nouveaux utilisateurs */}
        <OnboardingModal 
            open={showOnboarding}
            // onClose={() => setShowOnboarding(false)}
            onComplete={handleOnboardingComplete}
        />
    </>)
}