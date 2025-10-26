type Props = { params: { id: string } }

export default function VestingDetails({ params }: Props) {
    const { id } = params
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">Vesting Details</h1>
            <p className="text-gray-600">Schedule ID: {id}</p>
            <p className="text-gray-600">Vesting schedule details</p>
        </main>
    )
}
