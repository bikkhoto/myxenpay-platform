import { MYXN_TOKEN_DISPLAY } from "@/config/token";
type Props = { params: { mintAddress: string } }

export default function TokenAnalytics({ params }: Props) {
    const { mintAddress } = params
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Analytics</h1>
            <p className="text-gray-600">Mint Address: {mintAddress}</p>
            <p className="text-gray-600">{MYXN_TOKEN_DISPLAY} performance analytics</p>
        </main>
    )
}
