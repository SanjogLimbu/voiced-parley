export default function LoadingPage() {
    return (
        <>
            <div role="status" className="flex flex-1 items-center justify-center gap-3 text-accent">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />

                <span>
                    Loading...
                </span>
            </div>
        </>
    )
}
