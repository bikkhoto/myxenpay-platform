import { MYXN_TOKEN_DISPLAY } from "@/config/token";

export default function BurnsPage() {
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Real Revenue Burns</h1>
            <p className="text-gray-600">Revenue burn mechanism details for {MYXN_TOKEN_DISPLAY}</p>
        </main>
    )
}
