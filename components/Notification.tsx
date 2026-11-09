export default function Notification(
{ 
    message, 
    onClose 
}: {
    message: string
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-2xl">
                <p className="mb-6 text-center text-sm">
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-white transition-all hover:brightness-110"
                >
                    OK
                </button>
            </div>
        </div>
    )
}
