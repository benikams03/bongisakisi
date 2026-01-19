import { Input } from "../ui/input"
import { FiSearch } from "react-icons/fi";
import { Card } from "../ui/card";
import { Bouton } from "../ui/bouton"
import { IoMdAdd } from "react-icons/io";

export function MedicationList() {
    return(<>
    <div class="w-full h-full py-6 px-4 rounded-lg shadow-xs border border-gray-400/50 bg-gray-50">
        <div>
            <h3 className="font-semibold text-xl">Liste des Medicaments</h3>
            <Input icons={<FiSearch className="text-gray-500" />}
                className="mt-3"
                placeholder="Recheercher un medicament..."/>
        </div>

        <div className="mt-2 overflow-auto h-[85%]">

            <Card className="!bg-gray-100 mb-2 flex justify-between items-center px-3 py-1">
                <div className="py-1">
                    <h3 className="text-lg font-semibold">Name</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <p>Categorie</p>
                        <div className="border border-l border-gray-500 h-4" />
                        <p>stock</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-xl">12 Fc</h2>
                    <Bouton className="px-2">
                        <IoMdAdd size={18} />
                    </Bouton>
                </div>
            </Card>

            
        </div>
    </div>
    </>)
}