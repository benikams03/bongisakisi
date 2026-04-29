import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronRight, ChevronLeft, Store, Mail, Phone, MapPin, Check, Package, Users, BarChart3, Settings, Shield } from 'lucide-react'
import { Bouton } from '../../ui/bouton/index'
import Modal from '@mui/material/Modal'
import { InputLabel } from "./../../ui/input/index"
import toast from 'react-hot-toast'
import logo  from './../../../assets/logo.png'

const OnboardingModal = ({ open, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0)
    
    // Configuration de react-hook-form avec validation
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        trigger
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: ''
        }
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
                        <img src={logo} alt="BongisaKisi" className="w-14 h-14" />
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
                    <div className="bg-green-50 border border-purple-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <Settings className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-semibold text-green-900">Administrateur</h4>
                        </div>
                        <p className="text-sm text-green-700">
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
                            {...register('name', {
                                required: 'Le nom de la pharmacie est obligatoire',
                                minLength: {
                                    value: 2,
                                    message: 'Le nom doit contenir au moins 2 caractères'
                                }
                            })}
                            helperText={errors.name?.message}
                            error={!!errors.name}
                        />
                        <InputLabel 
                            label="Email *"
                            icons={Mail}
                            placeholder="email@pharmacie.com"
                            type="email"
                            {...register('email', {
                                required: 'L\'email est obligatoire',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Format d\'email invalide'
                                }
                            })}
                            helperText={errors.email?.message}
                            error={!!errors.email}
                        />
                        <InputLabel 
                            label="Téléphone *"
                            icons={Phone}
                            placeholder="243 000 000 000"
                            {...register('phone', {
                                required: 'Le téléphone est obligatoire',
                                pattern: {
                                    value: /^[+]?[0-9\s\-()]+$/,
                                    message: 'Format de téléphone invalide'
                                },
                                minLength: {
                                    value: 10,
                                    message: 'Le téléphone doit contenir au moins 10 chiffres'
                                }
                            })}
                            helperText={errors.phone?.message}
                            error={!!errors.phone}
                        />
                        <InputLabel 
                            label="Adresse *"
                            icons={MapPin}
                            placeholder="123 Rue de la Pharmacie"
                            {...register('address', {
                                required: 'L\'adresse est obligatoire',
                                minLength: {
                                    value: 5,
                                    message: 'L\'adresse doit contenir au moins 5 caractères'
                                }
                            })}
                            helperText={errors.address?.message}
                            error={!!errors.address}
                        />
                    </div>
                </div>
            )
        }
    ]

    const isLastStep = currentStep === steps.length - 1
    const isFirstStep = currentStep === 0

    const handleNext = async () => {
        if (isLastStep) {
            // Valider tous les champs avant la soumission
            const isFormValid = await trigger()
            if (!isFormValid) {
                toast.error('Veuillez corriger les erreurs dans le formulaire')
                return
            }
            
            // Soumettre les données
            handleSubmit((data) => {
                onComplete(data)
                toast.success('Configuration terminée avec succès!')
            })()
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
        <Modal
            open={open}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4"
        >
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl overflow-hidden">
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
                            disabled={isLastStep && !isValid}
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
        </Modal>
    )
}

export default OnboardingModal
