import { MYXN_TOKEN_DISPLAY } from "@/config/token";

export default function TokenManagement() {
    return (
        <main className="p-8 space-y-2">
            <h1 className="text-2xl font-bold">{MYXN_TOKEN_DISPLAY} Management</h1>
            <p className="text-gray-600">Manage {MYXN_TOKEN_DISPLAY} settings and supply</p>
        </main>
    )
}
