"use client"

import LinkButton from "@/components/LinkButton"
import { useState } from "react"
import { useRouter } from "next/navigation"

//

export default function Home() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")

  return (
    <>
      <div className="w-full h-full flex flex-col gap-5 items-center justify-center p-10">
          <h1 className="primary mt-10">
              <b>
                  VOICED PARLEY
              </b>
          </h1>

          <p className="text-accent">
              Learn a language by actually having the conversations that matter. 
          </p>

          <h2 className="mt-25">
              <b>
                  Common Scenarios
              </b>
          </h2>

          <div className="grid grid-cols-3 justify-center gap-5">
              <LinkButton title="Cafe Ordering" />
              <LinkButton title="Restaurant Ordering" />
              <LinkButton title="Hotel Check-in" />
              <LinkButton title="Meeting Someone New" />
              <LinkButton title="Buying A Train Ticket" />
              <LinkButton title="Asking For Directions" />
          </div>
          
          <div className="w-full max-w-2xl flex items-center gap-3 my-1 text-accent">
              <div className="flex-1 border-t border-border" />

              <span className="text-xs font-bold">
                  OR
              </span>

              <div className="flex-1 border-t border-border" />
          </div>

          {prompt.length < 5 && prompt.length > 0 ? (
            <p className="text-danger">
                Scenario is too short.
            </p> 
          ): prompt.length > 0 && (
            <p className="text-danger">
                Scenario is too long.
            </p>
          )}

          <form 
              className="relative w-[30%]"
              onSubmit={() => router.push(`/parley/?scenario=${prompt}`)}
          >
              <input 
                  className="input_box"
                  placeholder="A Custom Scenario"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
              />

              <button
                  type="submit"
                  aria-label="Submit prompt"
                  className={`
                      absolute top-1.5 right-1.5 w-7 h-7 rounded-md text-white flex items-center justify-center 
                      cursor-pointer transition-all hover:brightness-110 active:scale-95 
                      ${prompt.length < 5 || prompt.length > 100 ? "bg-danger" : "bg-primary"}
                  `}
              >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
              </button>
          </form>
      </div>
    </>
  )
}
