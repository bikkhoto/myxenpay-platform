import { MYXN_TOKEN_DISPLAY } from "@/config/token";

export default function SwapInterface() {
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Swap</h1>
            <p className="text-gray-600">Swap {MYXN_TOKEN_DISPLAY} with supported assets</p>
        </main>
    )
}
