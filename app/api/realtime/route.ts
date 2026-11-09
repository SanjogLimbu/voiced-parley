import { NextResponse } from "next/server"

//

export async function POST() {
    try {
        const response = await fetch(
            "https://api.openai.com/v1/realtime/client_secrets",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session: {
                        type: "realtime",
                        model: "gpt-realtime-2.1"
                    }
                })
            }
        )

        
        if (!response.ok) {
            throw new Error("Failed to create realtime session.")
        }


        const data = await response.json()

        return NextResponse.json({
            token: data.value
        })
    } 
    catch (error) {
        console.error("Realtime API error:", error)

        return NextResponse.json(
            { error: "Failed to create voice session." },
            { status: 500 }
        )
    }
}
