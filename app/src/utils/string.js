/**
 * 
 * @param {string} str 
 * @returns Premiere lettre en majuscule et les restes en muniscule.
 */
export function capitalize ( str ) {
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 
 * @param {string} str 
 * @returns Enleve les espaces devant et derrier un phrase.
 */
export function removeSpaces ( str ) {
    return str.trim();
}