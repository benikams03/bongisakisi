/**
 * Transforme une date du format YYYY-MM-DD en DD/MM/YYYY
 * @param {string} dateString - Date au format YYYY-MM-DD
 * @returns {string} Date au format DD/MM/YYYY
 */
export function formatDateToDMY(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day} / ${month} / ${year}`;
}


export function isExpiringSoon(dateExpiration) {
    if (!dateExpiration) return false;
    
    const expDate = new Date(dateExpiration);
    const today = new Date();
    
    // Remettre à minuit pour comparer uniquement les dates
    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);
    
    // Calculer la différence en jours
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log('Date expiration:', dateExpiration);
    console.log('Date actuelle:', today.toISOString().split('T')[0]);
    console.log('Jours restants:', diffDays);
    
    if (diffDays < 0) {
        return "expirer";  // Déjà expiré
    } else if (diffDays <= 30) {
        return "bientot";   // Expire dans 30 jours ou moins
    } else {
        return false;         // Plus de 30 jours
    }
}

export const isExpired = (date) => {
    return new Date(date) < new Date()
}


/**
 * Formate une date au format "DD / MM / YYYY à HH : MM"
 * @param {string} dateString - Date au format ISO string ou YYYY-MM-DD
 * @returns {string} Date au format "DD / MM / YYYY à HH : MM"
 */
export function formatDateToDMYWithTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} / ${month} / ${year} à ${hours} : ${minutes}`;
}


export function formatTimeOnly(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return dateString;
 
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours} : ${minutes}`;
}