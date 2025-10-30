import { MYXN_TOKEN_DISPLAY } from "@/config/token";

export default function TokenMarketplace() {
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Marketplace</h1>
            <p className="text-gray-600">Discover and trade {MYXN_TOKEN_DISPLAY}</p>
        </main>
    )
}
