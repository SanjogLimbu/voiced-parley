import { useSearchParams } from "next/navigation"

//

export default function Parley() {
    const searchParams = useSearchParams()
    const scenario = searchParams.get("scenario")

    return (
        <>

        </>
    )
}

