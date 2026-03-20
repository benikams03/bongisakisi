import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Store, Mail, Phone, MapPin, Check, Package, Users, BarChart3, Settings, Shield } from 'lucide-react'
import { Bouton } from '../../ui/bouton/index'
import Drawer from "@mui/material/Drawer"
import { InputLabel } from "./../../ui/input/index"

const OnboardingModal = ({ open, onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [pharmacyInfo, setPharmacyInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    const steps = [
        {
            id: 'welcome',
            title: 'Bienvenue dans BongisaKisi',
            description: 'Votre solution complète de gestion pharmaceutique',
            icon: Package,
            content: (
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                        <Package className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        BongisaKisi est conçu pour simplifier la gestion de votre pharmacie. 
                        Suivez ce guide rapide pour découvrir toutes les fonctionnalités.
                    </p>
                </div>
            )
        },
        {
            id: 'profiles',
            title: 'Choisissez votre profil',
            description: 'Deux rôles pour gérer efficacement votre pharmacie',
            icon: Users,
            content: (
                <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                <Settings className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-semibold text-purple-900">Administrateur</h4>
                        </div>
                        <p className="text-sm text-purple-700">
                            Gestion complète des produits, stocks, rapports et paramètres système
                        </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-semibold text-green-900">Caissier</h4>
                        </div>
                        <p className="text-sm text-green-700">
                            Ventes, transactions et suivi des opérations quotidiennes
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'features',
            title: 'Fonctionnalités principales',
            description: 'Découvrez les outils puissants à votre disposition',
            icon: BarChart3,
            content: (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                        <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">Gestion des stocks</h4>
                        <p className="text-xs text-blue-700">Suivi en temps réel</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                        <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-orange-900 text-sm mb-1">Rapports détaillés</h4>
                        <p className="text-xs text-orange-700">Analyse complète</p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
                        <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-indigo-900 text-sm mb-1">Sécurité</h4>
                        <p className="text-xs text-indigo-700">Protection des données</p>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-center">
                        <Settings className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-pink-900 text-sm mb-1">Personnalisation</h4>
                        <p className="text-xs text-pink-700">Adaptable à vos besoins</p>
                    </div>
                </div>
            )
        },
        {
            id: 'pharmacy-info',
            title: 'Informations de la pharmacie',
            description: 'Personnalisons votre expérience',
            icon: Store,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                        Pour finaliser la configuration, veuillez fournir les informations de votre pharmacie :
                    </p>
                    <div className="space-y-3">
                        <InputLabel 
                            label="Nom de la pharmacie *"
                            icons={Store}
                            placeholder="Pharmacie du Centre"
                            value={pharmacyInfo.name}
                            onChange={(e) => setPharmacyInfo({...pharmacyInfo, name: e.target.value})}
                        />
                        <InputLabel 
                            label="Email *"
                            icons={Mail}
                            placeholder="email@pharmacie.com"
                            value={pharmacyInfo.email}
                            onChange={(e) => setPharmacyInfo({...pharmacyInfo, email: e.target.value})}
                        />
                        <InputLabel 
                            label="Téléphone *"
                            icons={Phone}
                            placeholder="+243 000 000 000"
                            value={pharmacyInfo.phone}
                            onChange={(e) => setPharmacyInfo({...pharmacyInfo, phone: e.target.value})}
                        />
                        <InputLabel 
                            label="Adresse *"
                            icons={MapPin}
                            placeholder="123 Rue de la Pharmacie"
                            value={pharmacyInfo.address}
                            onChange={(e) => setPharmacyInfo({...pharmacyInfo, address: e.target.value})}
                        />
                    </div>
                </div>
            )
        }
    ]

    const isLastStep = currentStep === steps.length - 1
    const isFirstStep = currentStep === 0

    const handleNext = () => {
        if (isLastStep) {
            // Valider les champs obligatoires
            if (!pharmacyInfo.name || !pharmacyInfo.email || !pharmacyInfo.phone || !pharmacyInfo.address) {
                alert('Veuillez remplir tous les champs obligatoires')
                return
            }
            onComplete(pharmacyInfo)
        } else {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(currentStep - 1)
        }
    }

    const progress = ((currentStep + 1) / steps.length) * 100

    const currentStepData = steps[currentStep]
    const Icon = currentStepData.icon

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                className: "bg-white shadow-xl border border-gray-200 rounded-t-3xl text-black max-h-[90vh] overflow-hidden"
            }}
        >
            <div className="w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {currentStepData.title}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {currentStepData.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Étape {currentStep + 1} sur {steps.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-8">
                    <div className="min-h-[300px]">
                        {currentStepData.content}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            {!isFirstStep && (
                                <Bouton 
                                    outline
                                    onClick={handlePrevious}
                                    className="flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Précédent
                                </Bouton>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentStep 
                                            ? 'bg-emerald-500' 
                                            : index < currentStep 
                                                ? 'bg-emerald-300' 
                                                : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <Bouton 
                            primary
                            onClick={handleNext}
                            className="flex items-center gap-2"
                            disabled={isLastStep && (!pharmacyInfo.name || !pharmacyInfo.email || !pharmacyInfo.phone || !pharmacyInfo.address)}
                        >
                            {isLastStep ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Terminer la configuration
                                </>
                            ) : (
                                <>
                                    Suivant
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Bouton>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}

export default OnboardingModal
