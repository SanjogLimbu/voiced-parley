import Link from "next/link"

//

export default function LinkButton(
{
    scenario,
    language
} : {
    scenario: string
    language: string
}) {
    return (
        <Link
            className="
                flex items-center justify-center rounded-xl border border-border bg-surface/70 p-4 font-medium transition-all 
                hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary
            "
            href={{ 
                pathname: "/parley", 
                query: { scenario, language } 
            }}
        >
            {scenario}
        </Link>
    )
}
