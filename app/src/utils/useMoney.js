export function useFormMoney(value) {
    if (value === null || value === undefined) return ""; // Retourne vide si valeur invalide
    
    // Convertir en string
    let str = String(value);

    // Ajouter un espace toutes les 3 chiffres avant le point décimal (ou fin de chaîne)
    let parts = str.split("."); // pour gérer les décimales
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    
    return parts.join(".");
}