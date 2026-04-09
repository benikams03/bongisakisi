export const number = {

    format: (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    pourcentage: (a, b) => {
        if (!b || b === 0) {
            const result = (((a - 0) * 100) / 1).toFixed(1);
            return result >= 0 ? '100' : '-100';
        }
        return (((a - b) * 100) / b).toFixed(1)
    }

}