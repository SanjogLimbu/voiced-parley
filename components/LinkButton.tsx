import Link from "next/link"

//

export default function LinkButton(
{ 
    title 
} : { 
    title: string 
}) {
    return (
        <Link 
            className="bg-background w-50 h-10 flex justify-center items-center border border-border rounded-md transition-all cursor-pointer hover:bg-primary"
            href={`/parley?scenario=${title}`}
        >
            {title}
        </Link>
    )
}

