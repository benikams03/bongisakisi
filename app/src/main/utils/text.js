export class Text {
    // Capitaliser chaque mot dans une phrase
    static capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    // Mettre la première lettre en majuscule
    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Mettre tout en minuscules
    static toLowerCase(str) {
        if (!str) return '';
        return str.toLowerCase();
    }

    // Nettoyer et formater un numéro de téléphone
    static formatPhone(phone) {
        if (!phone) return '';
        // Supprimer tous les caractères non numériques sauf + et espaces
        return phone.replace(/[^\d\s\+]/g, '').trim();
    }

    // Valider un email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Générer un ID unique
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Tronquer un texte
    static truncate(str, length = 50) {
        if (!str) return '';
        return str.length > length ? str.substr(0, length) + '...' : str;
    }

    // Nettoyer les espaces
    static trim(str) {
        if (!str) return '';
        return str.replace(/^\s+|\s+$/g, '');
    }

    // Extraire les nombres d'une chaîne
    static extractNumbers(str) {
        if (!str) return '';
        return str.replace(/\D/g, '');
    }

    // Formater une date
    static formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Calculer le temps écoulé
    static timeAgo(date) {
        if (!date) return '';
        const now = new Date();
        const past = new Date(date);
        const diff = now - past;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} jour(s)`;
        if (hours > 0) return `${hours} heure(s)`;
        return `${minutes} minute(s)`;
    }

    // Anciennes méthodes pour compatibilité
    static trim(value) {
        if (typeof value !== "string") return "";
        return value.trim();
    }

    static toLowerCase(value) {
        if (typeof value !== "string") return "";
        return value.trim().toLowerCase();
    }

    static toUpperCase(value) {
        if (typeof value !== "string") return "";
        return value.trim().toUpperCase();
    }

    static capitalizeFirst(value) {
        if (typeof value !== "string" || !value.length) return "";
        
        const lower = value.toLowerCase().trim();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    static removeSpecialChars(value) {
        if (typeof value !== "string") return "";
        return value.replace(/[^a-zA-Z0-9]/g, "");
    }

    static toKebabCase(value) {
        if (typeof value !== "string") return "";

        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
    }

    static toCamelCase(value) {
        if (typeof value !== "string") return "";

        return value
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .map((word, index) =>
                index === 0
                    ? word
                    : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join("");
    }

    static toSnakeCase(value) {
        if (typeof value !== "string") return "";

        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^\w]/g, "");
    }

    static removeAllSpaces(value) {
        if (typeof value !== "string") return "";
        return value.replace(/\s+/g, "");
    }
}