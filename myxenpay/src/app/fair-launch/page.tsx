import { MYXN_TOKEN_DISPLAY } from "@/config/token";

export default function FairLaunchPage() {
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Fair Launch</h1>
            <p className="text-gray-600">{MYXN_TOKEN_DISPLAY} launch information</p>
        </main>
    )
}
