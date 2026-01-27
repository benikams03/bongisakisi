import { Card } from "./../ui/card"
import { IoReceiptOutline } from "react-icons/io5";
import { GiTakeMyMoney } from "react-icons/gi";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useFormMoney } from "../../utils/useMoney";

export function Header({ data }) {
    return(
        <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="flex gap-4 px-8 py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                    <IoReceiptOutline size={32} />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Ventes du jour</p>
                    <p className="text-2xl font-bold text-foreground">{data.totalAchats}</p>
                </div>
            </Card>

            <Card className="flex gap-4 px-8 py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                    <GiTakeMyMoney size={32} />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Total recolt</p>
                    <p className="text-2xl font-bold text-foreground">{useFormMoney(data.totalPrix)} Fc</p>
                </div>
            </Card>

            <Card className="flex gap-4 px-8 py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                    <HiMiniArrowTrendingUp size={32} className="text-green-500" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Benefice du jour</p>
                    <p className="text-2xl font-bold text-green-500">{useFormMoney(data.totalBenefice)} Fc</p>
                </div>
            </Card>
        </div>
    )
}