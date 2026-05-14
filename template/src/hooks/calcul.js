/**
 * Calcule le statut de stock en fonction du stock actuel et du stock initial
 * @param {number} currentStock - Stock actuel
 * @param {number} initialStock - Stock initial (last_stock)
 * @returns {object} - Objet avec statut et pourcentage
 */
export function calculateStockStatus(currentStock, initialStock, color, bgcolor) {
    if (!currentStock || !initialStock) {
        return {
            status: 'inconnu',
            percentage: 0,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100'
        };
    }

    const percentage = ((currentStock / initialStock) * 100);
    
    if (percentage <= 20) {
        return {
            status: 'critique',
            percentage: percentage,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        };
    } else if (percentage <= 45) {
        return {
            status: 'faible',
            percentage: percentage,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        };
    } else {
        return {
            status: 'bon',
            percentage: percentage,
            color: color,
            bgColor: bgcolor
        };
    }
}

export default calculateStockStatus;