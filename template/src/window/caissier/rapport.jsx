import { Bouton } from "../../components/ui/bouton";
import { Download, Printer } from "lucide-react";

export default function Rapport() {
    return (<>
    
    <div className="flex-1 p-2.5">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Rapports</h3>
            <div className="flex gap-2">
                <Bouton primary>
                    <Download className="w-4 h-4" />
                    Exporter PDF
                </Bouton>
                <Bouton outline>
                    <Printer className="w-4 h-4" />
                    Imprimer
                </Bouton>
            </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
            {[
                { label: 'Ventes du jour', value: '125,000 FC', change: '+12%', positive: true },
                { label: 'Bénéfice du jour', value: '2,778 FC', change: '+5%', positive: true },
                { label: 'Commandes validées', value: '45', change: '-3%', positive: false },
                { label: 'Articles vendus', value: '156', change: '+8%', positive: true },
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Top 8 des médicaments vendus</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">#1</span>
                            <span className="text-sm text-gray-900">test</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">12 ventes</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Rapports disponibles</h4>
                <div className="space-y-3">
                    {[
                        'Rapport des ventes journalières',
                        'Rapport des stocks',
                        'Rapport des fournisseurs',
                    ].map((report, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{report}</span>
                            <div className="flex gap-2">
                                <Bouton outline className="text-xs">
                                    <Download className="w-3 h-3" />
                                </Bouton>
                                <Bouton outline className="text-xs">
                                    <Printer className="w-3 h-3" />
                                </Bouton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

    </>)
}