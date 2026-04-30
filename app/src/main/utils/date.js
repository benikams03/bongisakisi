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