"use client"

import LinkButton from "@/components/LinkButton"
import { useState } from "react"
import { useRouter } from "next/navigation"
import SubmitButton from "@/components/SubmitButton"

//

const SCENARIOS = [
  "Cafe Ordering",
  "Restaurant Ordering",
  "Hotel Check-in",
  "Meeting Someone New",
  "Buying A Train Ticket",
  "Asking For Directions",
]

const MIN_LENGTH = 5
const MAX_LENGTH = 50

//

export default function Home() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")

  const length = prompt.trim().length
  const error = length === 0 ? null
      : length < MIN_LENGTH ? "Scenario is too short."
      : length > MAX_LENGTH ? "Scenario is too long."
      : null
  const isValid = length > 0 && !error

  return (
    <>
      <main className="flex flex-1 flex-col items-center px-6 py-20">
          <h1 className="text-center text-5xl font-bold tracking-tight sm:text-7xl">
            VOICED PARLEY
          </h1>

          <p className="mt-5 max-w-md text-center text-md text-accent">
            Learn languages by having the conversations that matter.
          </p>

          <section className="mt-30 w-full max-w-4xl">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-accent flex justify-center">
                Common Scenarios
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {SCENARIOS.map((title) => (
                      <LinkButton key={title} title={title} />
                  ))}
              </div>
          </section>

          <div className="my-10 flex w-full max-w-4xl items-center gap-3 text-accent">
              <div className="flex-1 border-t border-border" />

              <span className="text-xs font-bold">
                OR
              </span>

              <div className="flex-1 border-t border-border" />
          </div>

          <section className="w-full max-w-xl">
              <form
                className="relative"
                onSubmit={(e) => {
                    e.preventDefault()
                      
                    if (isValid) {
                        router.push(`/parley?scenario=${encodeURIComponent(prompt.trim())}`)
                    }
                }}
              >
                  <input
                    className="input_box pr-12"
                    placeholder="Describe a custom scenario..."
                    aria-label="Custom scenario"
                    aria-invalid={!!error}
                    aria-describedby="scenario-hint"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  <button
                    type="submit"
                    aria-label="Submit prompt"
                    disabled={!isValid}
                    className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-primary text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-border disabled:text-accent"
                  >
                    <SubmitButton />
                  </button>
              </form>

              <div id="scenario-hint" className="mt-2 flex justify-between gap-4 text-xs">
                  <span className="text-danger">
                    {error}
                  </span>

                  <span className={length > MAX_LENGTH ? "text-danger" : "text-accent"}>
                    {length}/{MAX_LENGTH}
                  </span>
              </div>
          </section>
      </main>
    </>
  )
}
