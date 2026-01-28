export function useFormMoney(value) {
    if (value === null || value === undefined) return ""; // Retourne vide si valeur invalide
    let str = String(value);
    let parts = str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}