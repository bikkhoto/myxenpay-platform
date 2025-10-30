import { MYXN_TOKEN_DISPLAY } from "@/config/token";

export default function StakingDashboard() {
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Staking</h1>
            <p className="text-gray-600">Stake and earn with {MYXN_TOKEN_DISPLAY}</p>
        </main>
    )
}
