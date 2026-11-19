import { NextResponse } from "next/server"

import { buildInstructions } from "@/lib/prompts"
import { prompt_refused } from "@/lib/refusal_check"
import { MIN_SCENARIO_LENGTH, MAX_SCENARIO_LENGTH } from "@/lib/constants";

import OpenAI from "openai";

//

const client = new OpenAI();

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

    const scenario = body?.scenario.trim()
    const language = body?.language

    if (typeof scenario !== "string" || !scenario || scenario.length > MAX_SCENARIO_LENGTH || scenario.length < MIN_SCENARIO_LENGTH) {
        return NextResponse.json(
            { error: `Scenario must be between ${MIN_SCENARIO_LENGTH} and ${MAX_SCENARIO_LENGTH} characters.` },
            { status: 400 }
        )
    }

    if (typeof language !== "string" || !language.trim()) {
        return NextResponse.json(
            { error: "Invalid language." },
            { status: 400 }
        )
    }

    try {
        const response = await client.responses.create({
            model: "gpt-6-astra",
            instructions: buildInstructions(scenario, language),
            input: scenario,
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
