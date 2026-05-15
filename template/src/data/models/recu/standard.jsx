import Barcode from 'react-barcode';

export const StandardRecu = () => {
    return (<>
    <div className="text-sm">
        <div className="text-center text-xs">
            <h2 className="font-semibold text-2xl">Pharmacie</h2>
            <p>C/Exemple Q/Exemple</p>
            <p>Contact: +243 999 999 999</p>
        </div>

        <div className="border-t border-b border-gray-300 py-1 my-2 flex items-start justify-between mt-4">
            <p className="text-[12px]">Date & heure: 01/01/2026 à 12:00</p>
        </div>

        <table className="w-full mt-4">
            <thead className="text-[12px]">
                <tr className="border-b">
                    <th className="pb-2">Produit</th>
                    <th className="pb-2">Qté</th>
                    <th className="pb-2">Prix</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-gray-300">
                    <td className="text-start pl-4 py-2">Paracétamol 500mg</td>
                    <td className="qty text-center py-2">10</td>
                    <td className="font-[monospace] text-center py-2">10000 Fc</td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="text-start pl-4 py-2">Paracétamol 500mg</td>
                    <td className="qty text-center py-2">10</td>
                    <td className="font-[monospace] text-center py-2">10000 Fc</td>
                </tr>
                <tr>
                    <td className="text-start pl-4 py-2">Paracétamol 500mg</td>
                    <td className="qty text-center py-2">10</td>
                    <td className="font-[monospace] text-center py-2">10000 Fc</td>
                </tr>
            </tbody>
        </table>
        <div className="text-center">
            <h3><span className="font-semibold">Total:</span> 10 000 FC</h3>
        </div>
        <p className="text-center mt-3">Merci pour votre visite, à bientôt !</p>
        <div className='flex items-center justify-center'>
            <Barcode
                value="123456789"
                format="CODE128"
                height={40}
            />
        </div>
    </div>
    </>)
} 