import { MYXN_TOKEN_DISPLAY } from "@/config/token";
type Props = { params: { mintAddress: string } }

export default function TokenDetails({ params }: Props) {
    const { mintAddress } = params
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Details</h1>
            <p className="text-gray-600">Mint Address: {mintAddress}</p>
            <p className="text-gray-600">Individual {MYXN_TOKEN_DISPLAY} details</p>
        </main>
    )
}
