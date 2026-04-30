import React, { useState, useEffect } from 'react'
import { Modal, LinearProgress, } from '@mui/material'
import { FileText } from 'lucide-react'
import { Bouton } from '../../ui/bouton'

const LoadExportPDFModal = ({ open, onClose }) => {

    const [currentProgress, setCurrentProgress] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)


    useEffect(() => {
        let interval;
        
        if (open) {
            setIsCompleted(false)
            setCurrentProgress(0)

            interval = setInterval(()=> {
                setCurrentProgress(prev => {
                    if(prev >= 100) {
                        setIsCompleted(true)
                        return 100
                        }
                        return prev + 1
                    })
                }, 10)
        }
        
        // Nettoyer l'intervalle quand le modal se ferme
        return () => {
            if (interval) {
                clearInterval(interval)
                setIsCompleted(false)
                setCurrentProgress(0)
            }
        }
    }, [open])

    return (
        <Modal
            open={open}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
            <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">

                <div className='flex gap-2 items-center'>
                    <FileText size={24} color="#1976d2"/>
                    <h2>Exportation PDF</h2>
                </div>

                <p className='pt-3 text-gray-700 text-sm'>
                    {isCompleted ? 'Exportation terminée!' : 'Préparation...'}
                </p>

                <div className='flex items-center'>
                    <div className='w-full'>
                        <LinearProgress 
                            variant="determinate" 
                            value={currentProgress} 
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: isCompleted ? '#4caf50' : '#1976d2'
                                }
                            }}
                        />
                    </div>
                    <p className='text-sm pl-3'>{currentProgress}%</p>
                </div>

                { isCompleted && 
                    <Bouton onClick={onClose} className='w-full mt-2' outline>
                        Fermer
                    </Bouton> }
                
            </div>
        </Modal>
    )
}

export default LoadExportPDFModal
