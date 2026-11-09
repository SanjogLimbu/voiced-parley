"use client"

import { useEffect, useRef, useState } from "react"
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime"
import { buildVoiceInstructions } from "@/lib/prompts"

//

export default function VoiceChat({
    scenario,
    language,
    onClose
}: {
    scenario: string
    language: string
    onClose: () => void
}) {
    const sessionRef = useRef<RealtimeSession | null>(null)
    const connectingRef = useRef(false)

    const [connected, setConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        return () => {
            sessionRef.current?.close()
            sessionRef.current = null
        }
    }, [])


    async function startVoice() {
        if (connectingRef.current || sessionRef.current) {
            return
        } 


        connectingRef.current = true
        setConnecting(true)
        setError("")

        let session: RealtimeSession | null = null

        try {
            const response = await fetch(
                "/api/realtime", 
                {
                    method: "POST"
                }
            )


            if (!response.ok) {
                throw new Error("Unable to create voice session.")
            }


            const { token } = await response.json()

            const agent = new RealtimeAgent({
                name: "Voiced Parley",
                instructions: buildVoiceInstructions(scenario, language)
            })


            session = new RealtimeSession(agent, {
                model: "gpt-realtime-2.1",
                config: {
                    audio: {
                        // We set eagerness low as beginners are likely to pause a lot to think.
                        // The AI should also be able to interrupt the user so that it's more realistic and feels more responsive.
                        input: {
                            turnDetection: {
                                type: "semantic_vad",
                                eagerness: "low",
                                createResponse: true,
                                interruptResponse: true
                            }
                        },


                        // We should set the default voice speed to something low so it's actually understable for beginner language learners.
                        output: {
                            speed: 0.8
                        }
                    }
                }
            })


            sessionRef.current = session

            await session.connect({
                apiKey: token
            })


            setConnected(true)


            // The AI should speak first to initiate the conversation as beginners may not know how to.
            session.sendMessage(
                "Start the roleplay by greeting the learner " +
                "naturally in the target language."
            )

        } 
        catch (error) {
            console.error(error)
            session?.close()
            sessionRef.current = null
            setConnected(false)
            setError("Unable to connect. Please try again.")
        } 
        finally {
            connectingRef.current = false
            setConnecting(false)
        }
    }


    function endVoice() {
        sessionRef.current?.close()
        sessionRef.current = null
        setConnected(false)
        onClose()
    }


    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
            <div>
                <p className="text-sm text-accent">
                    {language}
                </p>

                <h2 className="text-xl font-semibold">
                    {scenario}
                </h2>
            </div>

            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border bg-surface text-5xl">
                🎙️
            </div>

            <p className="text-sm text-accent">
                {connecting
                    ? "Connecting..."
                    : connected
                    ? "Voice conversation active"
                    : "Ready to practise"}
            </p>

            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            {!connected && (
                <button
                    type="button"
                    onClick={startVoice}
                    disabled={connecting}
                    className="rounded-lg bg-primary px-6 py-3 text-white disabled:opacity-50 cursor-pointer"
                >
                    {connecting ? "Connecting..." : "Start speaking"}
                </button>
            )}

            <button
                type="button"
                onClick={endVoice}
                className="rounded-lg border border-border px-6 py-3 cursor-pointer hover:bg-surface"
            >
                {connected ? "End conversation" : "Go back"}
            </button>
        </div>
    )
}

