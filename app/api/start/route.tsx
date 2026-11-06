import { NextResponse } from "next/server"
import { buildInstructions } from "@/lib/prompts"
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


    const scenario = body.scenario
    const language = body.language

    if (typeof scenario !== "string" || !scenario.trim() || scenario.length > 50) {
        return NextResponse.json(
            { error: "Scenario must be between 1 and 50 characters." },
            { status: 400 }
        )
    }


    const response = await client.responses.create({
        model: "gpt-6-astra",
        instructions: buildInstructions(scenario, language),
        input: scenario,
    })


    return NextResponse.json({
        text: response.output_text,
        role: "Bot"
    })
}
