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

/**
 * Transforme une date en format lisible français
 * @param {string} dateString - Date au format YYYY-MM-DD ou YYYY-MM
 * @returns {string} Date au format "2 mars 2008" ou "mars 2008"
 */
export function formatDateToFrench(dateString) {
    if (!dateString) return '';
    
    // Vérifier si c'est juste une année (format YYYY)
    if (dateString.match(/^\d{4}$/)) {
        return dateString;
    }
    
    // Vérifier si c'est juste YYYY-MM (pas de jour)
    if (dateString.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateString.split('-');
        const monthNames = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
        const monthIndex = parseInt(month) - 1;
        return `${monthNames[monthIndex]} ${year}`;
    }
    
    // Format complet YYYY-MM-DD
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthNames = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    return `${day} ${monthNames[month]} ${year}`;
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

export function getDaysRemaining(targetDate) {
    if (!targetDate) return null;
    
    const target = new Date(targetDate);
    const today = new Date();
    
    // Vérifier si la date est valide
    if (isNaN(target.getTime())) return null;
    
    // Remettre les heures à minuit pour comparer uniquement les jours
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    // Calculer la différence en millisecondes
    const diffMs = target - today;
    
    // Convertir en jours
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

