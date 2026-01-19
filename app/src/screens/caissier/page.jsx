import Layout_caissier from "./layout"
import { Header } from "../../components/caissier/header"
import {MedicationList} from "../../components/caissier/medication-list"
import {Facture} from "../../components/caissier/facture"

export default function Caissier() {
    return(
    <Layout_caissier>
        <div className="flex items-start gap-3 h-full">
            <div className="w-full h-[83%]">
                <Header />
                <MedicationList />
            </div>
            <div className="w-[40%] h-full">
                <Facture />
            </div>
        </div>
    </Layout_caissier>
    )
} 