const useFormttedData = (datatimStr) => {
    if(!datatimStr) return ''
    const date = new Date(datatimStr)
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

export { useFormttedData }