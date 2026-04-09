import { rapportService } from "../../services/caissier/rapport_service";
import { useState, useEffect } from "react";
import { number } from "./../../hooks/number"

export default function Rapport() {
    
    const [rapport, setRapport] = useState([]);

    useEffect(()=>{ 
        (async() => {
            const result = await rapportService.getRapport();
            setRapport(result);
        })()
    },[])
    
    return (<>
    
    <div className="flex-1 p-2.5 h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Rapports du jour</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
            {[
                { 
                    label: 'Ventes du jour', 
                    value: number.format(Number(rapport?.stats?.ventesDay)) + ' FC', 
                    change: number.pourcentage(rapport?.stats?.ventesDay , rapport?.stats_old?.ventesDay) + '%', 
                    positive: number.pourcentage(rapport?.stats?.ventesDay , rapport?.stats_old?.ventesDay) >= 0 ? true : false 
                },
                { 
                    label: 'Commandes validées', 
                    value: number.format(Number(rapport?.stats?.commandeDay)), 
                    change: number.pourcentage(rapport?.stats?.commandeDay , rapport?.stats_old?.commandeDay) + '%', 
                    positive: number.pourcentage(rapport?.stats?.commandeDay , rapport?.stats_old?.commandeDay) >= 0 ? true : false
                },
                { 
                    label: 'Articles vendus', 
                    value: number.format(Number(rapport?.stats?.produitDay)), 
                    change: number.pourcentage(rapport?.stats?.produitDay , rapport?.stats_old?.produitDay) + '%', 
                    positive: number.pourcentage(rapport?.stats?.produitDay , rapport?.stats_old?.produitDay) >= 0 ? true : false 
                },
            ].map((stat, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stat.change}
                    </span>
                </div>
            ))}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Top 10 des médicaments vendus</h4>
                <div className="space-y-3">
                    { rapport?.topVentes?.map((items, index)=> (
                    <div key={index} className="flex justify-between items-center border-b border-dashed border-gray-300">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">#{index+1}</span>
                            <span className="text-sm text-gray-900">{items.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{items.quantiteTotale} ventes</span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

    </>)
}