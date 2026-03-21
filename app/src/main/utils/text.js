const Text = {

    /**
     * Remove leading and trailing spaces
     */
    trim(value) {
        if (typeof value !== "string") return "";
        return value.trim();
    },

    /**
     * Remove ALL spaces (including between words)
     */
    removeAllSpaces(value) {
        if (typeof value !== "string") return "";
        return value.replace(/\s+/g, "");
    },
    
    /**
     * Convert string to lowercase
     */
    toLowerCase(value) {
        if (typeof value !== "string") return "";
        return value.trim().toLowerCase();
    },

    /**
     * Convert string to uppercase
     */
    toUpperCase(value) {
        if (typeof value !== "string") return "";
        return value.trim().toUpperCase();
    },

    /**
     * Capitalize first letter only
     * Example: "bonjour TOUT LE MONDE" → "Bonjour tout le monde"
     */
    capitalizeFirst(value) {
        if (typeof value !== "string" || !value.length) return "";
        
        const lower = value.toLowerCase().trim();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    },

    /**
     * Capitalize each word
     * Example: "bonjour tout le monde" → "Bonjour Tout Le Monde"
     */
    capitalizeWords(value) {
        if (typeof value !== "string") return "";

        return value
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },

    /**
     * Remove special characters (keep letters & numbers only)
     */
    removeSpecialChars(value) {
        if (typeof value !== "string") return "";
        return value.replace(/[^a-zA-Z0-9]/g, "");
    },

    /**
     * Convert to kebab-case
     * Example: "Bonjour Tout Le Monde" → "bonjour-tout-le-monde"
     */
    toKebabCase(value) {
        if (typeof value !== "string") return "";

        return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    },

    /**
     * Convert to camelCase
     * Example: "bonjour tout le monde" → "bonjourToutLeMonde"
     */
    toCamelCase(value) {
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
    },

    /**
     * Convert to snake_case
     */
    toSnakeCase(value) {
        if (typeof value !== "string") return "";

        return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");
    }
};

export default Text;