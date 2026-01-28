export function useFormatDateToLabel(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Normaliser les dates à minuit pour comparaison
    const normalize = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const normalizedInput = normalize(inputDate);
    const normalizedToday = normalize(today);
    const normalizedYesterday = normalize(yesterday);

    // Format de l'heure : HH:MM
    const pad = n => n.toString().padStart(2, '0');
    const hours = pad(inputDate.getHours());
    const minutes = pad(inputDate.getMinutes());
    const timeString = `${hours}:${minutes}`;

    if (normalizedInput.getTime() === normalizedToday.getTime()) {
        return `Aujourd'hui à ${timeString}`;
    } else if (normalizedInput.getTime() === normalizedYesterday.getTime()) {
        return `Hier à ${timeString}`;
    } else {
        const jours = [
            "Dimanche", "Lundi", "Mardi", "Mercredi",
            "Jeudi", "Vendredi", "Samedi"
        ];
        const jour = jours[inputDate.getDay()];
        const day = pad(inputDate.getDate());
        const month = pad(inputDate.getMonth() + 1);
        return `${jour} ${day}/${month} à ${timeString}`;
    }
}
