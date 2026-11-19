import OpenAI from "openai"

//

export function prompt_refused(response: OpenAI.Responses.Response) {
    const refusal = response.output
        .flatMap(item => item.type === "message" ? item.content : [])
        .find(part => part.type === "refusal")

    return refusal || response.status == "incomplete" || response.output_text.trim().length == 0
}
