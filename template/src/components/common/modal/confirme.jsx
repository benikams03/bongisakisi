import React, { useState } from 'react';
import Modal from "@mui/material/Modal";
import { Bouton } from '../../ui/bouton';

/**
 * Modal de confirmation avec retour utilisateur
 * @param {boolean} open - État d'ouverture du modal
 * @param {function} onConfirm - Fonction appelée si l'utilisateur confirme
 * @param {function} onCancel - Fonction appelée si l'utilisateur annule
 * @param {string} title - Titre du modal
 * @param {string} message - Message de confirmation
 * @param {string} confirmText - Texte du bouton de confirmation
 * @param {string} cancelText - Texte du bouton d'annulation
 */
export default function ConfirmModal({ 
    open, 
    onConfirm, 
    onCancel, 
    title = "Confirmation requise", 
    message = "Êtes-vous sûr de vouloir continuer ?", 
    btn
}) {
    const [userResponse, setUserResponse] = useState('');

    const handleConfirm = () => {
        setUserResponse('confirmé');
        onConfirm();
    };

    const handleCancel = () => {
        setUserResponse('annulé');
        onCancel();
    };

    return (
        <Modal open={open} className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
            <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                
                <p className="text-gray-600 mb-6">{message}</p>
                
                
                <div className="flex gap-3">
                    <Bouton 
                        onClick={handleConfirm}
                        delet
                        className="flex-1"
                    >
                        {btn ? btn : "Supprimer"}
                    </Bouton>
                    
                    <Bouton 
                        onClick={handleCancel}
                        outline
                        className="flex-1"
                    >
                        Annuler
                    </Bouton>
                </div>
            </div>
        </Modal>
    );
}
