"use client"

import { useSearchParams  } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import LoadingPage from "@/components/LoadingPage"
import SubmitButton from "@/components/SubmitButton"

//

type Message = {
    text: string
    role: "User" | "Bot"
}

//

function TextBubble({ text, role }: Message) {
    return (
        <div
            className={`w-fit max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap wrap-anywhere ${
                role === "User"
                ? "ml-auto rounded-br-md bg-primary text-white"
                : "mr-auto rounded-bl-md border border-border bg-surface"
            }`}
        >
            {text}
        </div>
    )
}


function Content() {
    const searchParams = useSearchParams()
    const scenario = searchParams.get("scenario")
    const language = searchParams.get("language")

    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState("")
    const [starting, setStarting] = useState(false) 
    const [error, setError] = useState("")

    const conversationActive = messages.length > 0
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    }, [messages])

    
    if (!scenario) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <h1 className="text-2xl font-semibold">
                    No scenario selected
                </h1>

                <p className="text-accent">
                    Pick a scenario to start a conversation.
                </p>

                <Link href="/" className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:brightness-110">
                    Choose a scenario
                </Link>
            </main>
        )
    }


    async function startConversation() {
        setStarting(true)

        try {
            const response = await fetch(
                "/api/start",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        scenario,
                        language
                    })
                }
            )

            
            if (response.ok) {
                const data = await response.json()

                setMessages((previous) => [
                    ...previous,
                    { 
                        text: data.text, 
                        role: "Bot" 
                    },
                ])
            }
        }
        catch {
            setError("A network error occured.")
        }


        setStarting(false)
    }


    async function sendMessage(event: React.SubmitEvent<HTMLElement>) {
        event.preventDefault()

        try {
            const response = await fetch(
                "/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        scenario,
                        language,
                        message
                    })
                }
            )

            
            if (response.ok) {
                const data = await response.json()

                setMessages((previous) => [
                    ...previous,
                    { 
                        text: data.text, 
                        role: "Bot" 
                    },
                ])
            }
        }
        catch {
            setError("A network error occured.")
        }
    }


    return (
        <>
            <main className="flex h-dvh justify-center p-3 sm:p-6">
                <div className="flex w-full max-w-3xl min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/40">
                    <header className="flex items-center gap-3 border-b border-border px-4 py-3">
                        <Link
                            href="/"
                            aria-label="Back to scenarios"
                            className="
                                flex h-9 w-20 bg-background border border-border items-center justify-center rounded-lg text-accent transition-colors 
                                hover:bg-primary hover:text-foreground
                            "
                        >
                            Return
                        </Link>

                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-widest text-accent">
                                Scenario
                            </p>

                            <h1 className="truncate font-semibold">
                                {scenario}
                            </h1>
                        </div>
                    </header>

                    <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-6">
                        {!conversationActive ? (
                            <div className="m-auto flex max-w-xs flex-col items-center text-center">
                                <button 
                                    disabled={starting}
                                    onClick={startConversation}
                                    className="
                                        w-40 h-10 bg-background border border-border rounded-md cursor-pointer transition-all hover:bg-primary
                                    "
                                >
                                    {starting ? (
                                        "..." 
                                    ) : (
                                        "Start"
                                    )}
                                </button>
                            </div>
                        ) : messages.map((message, i) => (
                            <TextBubble key={i} {...message} />
                        ))}
                    </div>

                    {conversationActive && (
                        <form
                            className="flex items-center gap-2 border-t border-border p-3"
                            onSubmit={(e) => sendMessage(e)}
                        >
                            <input
                                className="input_box"
                                placeholder="Type your message..."
                                aria-label="Message"
                                autoFocus
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <button
                                type="submit"
                                aria-label="Send message"
                                disabled={!message.trim()}
                                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-border disabled:text-accent"
                            >
                                <SubmitButton />
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </>
    )
}


export default function Parley() {
    return (
        <Suspense fallback={<LoadingPage />}>
            <Content />
        </Suspense>
    )
}
