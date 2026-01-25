import { GiPill } from "react-icons/gi";
import { Bouton } from "./../../components/ui/bouton"
import { LuLogOut } from "react-icons/lu"; 
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function Layout_caissier({children}){

    const Deconnexion = () => {
        sessionStorage.removeItem('user');
        window.location.reload()
    }

    return(<>
    <header className="z-10 fixed top-0 left-0 w-full bg-white shadow flex h-16 items-center justify-between border-b border-gray-300 bg-card px-6">
        <div className="flex items-center gap-x-3">
            <GiPill size={24} />
            <div>
                <h2 className="text-center font-bold text-2xl ">
                    <span className="text-gray-400">BATELA</span>PHARMA
                </h2>   
            </div>
            <span className="rounded-md bg-secondary bg-gray-400/50 px-2 text-xs font-medium text-muted-foreground">
                Caissier
            </span>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <HiOutlineShoppingCart size={20} />
                <span>Point de Vente</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <Bouton
                onClick={Deconnexion}
                className="px-4">
                Déconnexion
                <LuLogOut size={16} />
            </Bouton>
        </div>
    </header>

    <main className="pt-19 p-4 bg-white h-screen overflow-hidden">{children}</main>
    </>)
}