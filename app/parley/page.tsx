"use client"

import { useSearchParams  } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import LoadingPage from "@/components/LoadingPage"
import SubmitButton from "@/components/SubmitButton"
import Notification from "@/components/Notification"

//

type Message = {
    id: string
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
    const [sending, setSending] = useState(false)

    const conversationActive = messages.length > 0
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    }, [messages])


    function displayMessage(message: string, role: "User" | "Bot") {
        const messageId = crypto.randomUUID()

        setMessages((previous) => [
            ...previous,
            { 
                id: messageId,
                text: message, 
                role: role
            },
        ])


        return messageId
    }


    function removeMessage(messageId: string) {
        setMessages(previous =>
            previous.filter(msg => msg.id !== messageId)
        )
    }

    
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
        if (starting) {
            return 
        }


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
                displayMessage(data.text, "Bot")
            }
        }
        catch {
            setError("A network error occured.")
        }


        setStarting(false)
    }


    async function sendMessage(event: React.SubmitEvent<HTMLElement>) {
        event.preventDefault()
        
        const trimmedMessage = message.trim()

        if (!trimmedMessage) {
            setError("Enter a valid message first!")

            return 
        }


        if (sending) {
            setError("Wait for a response first!")

            return
        }


        setSending(true)

        
        // Must capture history before updating message state as setting state is an async function.
        const history = [
            ...messages,
            {
                id: crypto.randomUUID(),
                text: trimmedMessage,
                role: "User" as const
            }
        ]


        const messageId = displayMessage(trimmedMessage, "User")
        setMessage("")
        setError("")

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
                        messages: history
                    })
                }
            )

            
            if (response.ok) {
                const data = await response.json()
                displayMessage(data.text, "Bot")
            }
            else {
                throw new Error("Request failed.")
            }
        }
        catch {
            setError("A network error occured.")
            setMessage(trimmedMessage)
            removeMessage(messageId)
        }


        setSending(false)
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

                    <div 
                        ref={listRef} 
                        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-6"
                    >
                        {!conversationActive ? (
                            <div className="m-auto flex max-w-xs flex-col items-center text-center">
                                <button 
                                    disabled={starting}
                                    onClick={startConversation}
                                    className="
                                        w-40 h-40 bg-background border border-border rounded-md cursor-pointer transition-all hover:bg-primary
                                    "
                                >
                                    {starting ? (
                                        "Starting..." 
                                    ) : (
                                        "Begin"
                                    )}
                                </button>
                            </div>
                        ) : messages.map((message) => (
                            <TextBubble key={message.id} {...message} />
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


            {error && (
                <Notification 
                    message={error}
                    onClose={() => {
                        setError("")
                    }}
                />
            )}
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
