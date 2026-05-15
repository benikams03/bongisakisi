export const StandardPDF = () => {
    return (<>
    <div className="text-sm">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <div className="bg-gray-900 text-gray-100 font-bold text-xl px-2.5 py-0.5 rounded-sm">+</div>
                <div className="font-bold text-gray-800 md:block hidden tracking-[-1px] uppercase font-['Inter',sans-serif]">BONGISA
                    <span className="font-light text-gray-600">KISI</span></div>
            </div>
            <div className="text-end text-xs">
                <h2 className="font-semibold">Pharmacie</h2>
                <p>C/Exemple Q/Exemple</p>
                <p>Email: pharmacie@exemple.com</p>
                <p>Contact: +243 999 999 999</p>
            </div>
        </div>

        <div className="border-t border-b border-gray-300 py-1 my-2 flex items-start justify-between mt-10">
            <div>
                <span className="font-semibold text-gray-500">RAPPORT DE VENTE</span>
            </div>
            <div>
                <span className="font-semibold text-gray-500">DATE D'EMISSION</span>
                <p className="text-end font-semibold">01/01/2026</p>
            </div>
        </div>

        <table className="w-full mt-4">
            <thead className="text-[11px] uppercase">
                <tr className="border-b-2 text-gray-500">
                    <th className="pb-2">Désignation Médicament</th>
                    <th className="pb-2">Catégorie</th>
                    <th className="pb-2">Qté</th>
                    <th className="pb-2">Prix Unitaire</th>
                    <th className="pb-2">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-gray-300">
                    <td className="text-start pl-4 py-2">Paracétamol 500mg</td>
                    <td className="text-center py-2">Antibiotique</td>
                    <td className="qty text-center py-2">10</td>
                    <td className="font-[monospace] text-center py-2">1000 Fc</td>
                    <td className="font-[monospace] text-center py-2">10000 Fc</td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="text-start pl-4 py-2">Paracétamol 500mg</td>
                    <td className="text-center py-2">Antibiotique</td>
                    <td className="qty text-center py-2">10</td>
                    <td className="font-[monospace] text-center py-2">1000 Fc</td>
                    <td className="font-[monospace] text-center py-2">10000 Fc</td>
                </tr>
                <tr>
                    <td className="text-start pl-4 py-2">Paracétamol 500mg</td>
                    <td className="text-center py-2">Antibiotique</td>
                    <td className="qty text-center py-2">10</td>
                    <td className="font-[monospace] text-center py-2">1000 Fc</td>
                    <td className="font-[monospace] text-center py-2">10000 Fc</td>
                </tr>
            </tbody>
        </table>

        <div className="mt-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="border border-gray-300 rounded py-2 px-4 uppercase text-[11px]">
                    <p className="kpi-label">Commandes Totales</p>
                    <p className="font-bold text-sm">12</p>
                </div>
                <div className="border border-gray-300 rounded py-2 px-4 uppercase text-[11px]">
                    <p className="kpi-label">Produits Sortis</p>
                    <p className="font-bold text-sm">30</p>
                </div>
                <div className="border border-gray-300 rounded py-2 px-4 uppercase text-[11px]">
                    <p className="kpi-label">Capital (Coût Achat)</p>
                    <p className="font-bold text-sm">10 000 FC</p>
                </div>
                <div className="border border-gray-300 rounded py-2 px-4 uppercase text-[11px]">
                    <p className="kpi-label">Bénéfice Réalisé</p>
                    <p className="text-green-600 font-bold text-sm">+ 5 000 FC</p>
                </div>
            </div>

            <div className="bg-black rounded mt-3 flex items-center text-[11px] justify-between text-white px-4 py-3">
                <div>
                    <span className="text-gray-400 uppercase">Chiffre d'Affaire Total</span>
                    <div className="font-bold text-lg">20 000 FC</div>
                </div>
                <div className="text-gray-400">
                    Aucune taxe incluse<br />
                    Validé par le Responsable
                </div>
            </div>

        </div>
    </div>
    </>)
} 