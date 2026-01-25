import { GiPill } from "react-icons/gi";
import { MdOutlineSettings } from "react-icons/md";
import { Outlet } from "react-router-dom"
import { Bouton } from "../../components/ui/bouton";
import { CardLink } from "../../components/ui/card";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuPill } from "react-icons/lu";
import { FiPackage } from "react-icons/fi";
import { AiOutlineBarChart } from "react-icons/ai";

export default function Layout_admin() {

    const Deconnexion = () => {
        sessionStorage.removeItem('user');
        window.location.reload()
    }

    return(<>
        <nav 
            className="
                w-[20%] fixed top-0 border-r border-gray-300 h-screen
                bg-white flex flex-col justify-between
            ">
            
            <div>
                <div className="border-b border-gray-300 flex items-center px-6 py-4 gap-2">
                    <GiPill size={24} />
                    <div>
                        <h2 className="text-center font-bold text-xl ">
                            <span className="text-gray-400">BATELA</span>PHARMA
                        </h2>   
                    </div>
                </div>
                <div className="flex flex-col gap-1 px-4 py-3">

                    <CardLink to="/admin/"
                        icone={<LuLayoutDashboard />}>
                        Tableau de bord</CardLink>

                    <CardLink to="/admin/medicament"
                        icone={<LuPill />}>
                        Médicaments</CardLink>

                    <CardLink to="/admin/stock"
                        icone={<FiPackage />}>
                        Stock</CardLink>

                    <CardLink to="/admin/rapport"
                        icone={<AiOutlineBarChart />}>
                        Rapports</CardLink>

                </div>
            </div>
            
            <div className="border-t border-gray-300 px-6 py-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MdOutlineSettings size={24} className="bg-gray-300 p-1 rounded-full" />
                    <p>Administrateur</p>
                </div>
                <Bouton
                    onClick={Deconnexion}
                    className="w-full mt-3">
                    Déconnexion
                </Bouton>
            </div>
        </nav>

        <main className="pl-[20%] bg-white pt-2">
            <div className="px-4 py-3">< Outlet /></div>
        </main>
    </>)
}