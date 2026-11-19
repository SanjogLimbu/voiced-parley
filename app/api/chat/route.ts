
import { NextResponse } from "next/server"

import { buildInstructions } from "@/lib/prompts"
import { prompt_refused } from "@/lib/refusal_check"
import { MAX_USER_LENGTH, MAX_BOT_LENGTH } from "@/lib/constants"

import OpenAI from "openai"

//

const client = new OpenAI()

type ChatMessage = {
    id: string
    text: string
    role: "User" | "Bot"
}

//

function isValidMessage(msg: ChatMessage) {
    if (!msg || typeof msg !== "object") {
        return false
    }

    const maxLength = msg.role === "User" ? MAX_USER_LENGTH : MAX_BOT_LENGTH

    return (
        (msg.role === "User" || msg.role === "Bot") &&
        typeof msg.text === "string" &&
        msg.text.trim() &&
        msg.text.length <= maxLength
    )
}

function isValidHistory(messages: ChatMessage[]) {
    return (
        Array.isArray(messages) &&
        messages.every(isValidMessage) &&
        messages.at(-1)?.role === "User"
    )
}

//

export async function POST(request: Request) {
    let body

    try {
        body = await request.json()
    }
    catch {
        return NextResponse.json(
            { error: "Invalid JSON." },
            { status: 400 }
        )
    }

    const scenario = body?.scenario
    const language = body?.language
    const messages = body?.messages

    if (typeof scenario !== "string" || !scenario.trim() || typeof language !== "string" || !language.trim()) {
        return NextResponse.json(
            { error: "Invalid scenario or language." },
            { status: 400 }
        )
    }

    if (!isValidHistory(messages)) {
        return NextResponse.json(
            { error: "Invalid conversation history." },
            { status: 400 }
        )
    }

    // Truncate message history to save on AI context limit.
    const length = messages.length 

    if (length > 100) {
        messages.splice(0, length - 100)
    }

    // Must convert roles to match OpenAI API
    const history = (messages as ChatMessage[]).map(msg => ({
        role: msg.role === "User"
            ? "user" as const
            : "assistant" as const,
        content: msg.text
    }))

    try {
        const response = await client.responses.create({
            model: "gpt-6-astra",
            instructions: buildInstructions(scenario, language),
            input: history,
            max_output_tokens: 300
        })

        if (prompt_refused(response)) {
            return NextResponse.json(
                { text: "The model could not respond." },
                { status: 502 }
            )
        }

        return NextResponse.json({
            text: response.output_text,
            role: "Bot"
        })
    }
    catch (error) {
        console.error("OpenAI API error:", error)

        return NextResponse.json(
            { error: "Failed to generate response." },
            { status: 500 }
        )
    }
}

