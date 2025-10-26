type Props = { params: { mintAddress: string } }

export default function TokenCommerce({ params }: Props) {
    const { mintAddress } = params
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">Token Commerce</h1>
            <p className="text-gray-600">Mint Address: {mintAddress}</p>
            <p className="text-gray-600">Token commerce settings</p>
        </main>
    )
}
