export function getDaysBeforeExpiration(date_expiration) {
    const today = new Date()
    const expiration = new Date(date_expiration)

    today.setHours(0, 0, 0, 0)
    expiration.setHours(0, 0, 0, 0)

    const diffTime = expiration - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays < 0 ? 0 : diffDays
}
