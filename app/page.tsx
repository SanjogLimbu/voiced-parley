"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import LinkButton from "@/components/LinkButton"
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

const LANGUAGES = [
  { name: "French", flag: "/flags/fr.svg" },
  { name: "Spanish", flag: "/flags/es.svg" },
  { name: "Italian", flag: "/flags/it.svg" },
  { name: "German", flag: "/flags/de.svg" },
  { name: "English", flag: "/flags/gb.svg" },
  { name: "Portuguese", flag: "/flags/pt.svg" },
  { name: "Dutch", flag: "/flags/nl.svg" },
  { name: "Swedish", flag: "/flags/se.svg" },
  { name: "Polish", flag: "/flags/pl.svg" },
  { name: "Russian", flag: "/flags/ru.svg" },
  { name: "Turkish", flag: "/flags/tr.svg" },
  { name: "Hindi", flag: "/flags/in.svg" },
  { name: "Mandarin", flag: "/flags/cn.svg" },
  { name: "Japanese", flag: "/flags/jp.svg" },
  { name: "Korean", flag: "/flags/kr.svg" },
]

const MIN_LENGTH = 5
const MAX_LENGTH = 50

//

function Divider() {
  return (
    <>
      <div className="my-10 flex w-full max-w-4xl items-center gap-3 text-accent">
        <div className="flex-1 border-t border-border" />

        <span className="text-xs font-bold">
          OR
        </span>

        <div className="flex-1 border-t border-border" />
      </div>
    </>
  )
}

function SelectScenario(
{ 
  language 
}: { 
  language: string 
}) {
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
      <section className="mt-30 w-full max-w-4xl">
          <legend className="mb-4 w-full text-center text-sm text-accent">
            Choose a scenario to practise
          </legend>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SCENARIOS.map((scenario) => (
                <LinkButton key={scenario} scenario={scenario} language={language} />
              ))}
          </div>
      </section>

      <Divider />

      <section className="w-full max-w-xl">
          <form
            className="relative"
            onSubmit={(e) => {
                e.preventDefault()
                  
                if (isValid) {
                  router.push(`/parley?scenario=${encodeURIComponent(prompt.trim())}&language=${encodeURIComponent(language)}`)
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
              aria-label="Submit scenario"
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
    </>
  )
}


function SelectLanguage(
{ 
  onSelect 
} : { 
  onSelect: (language: string) => void 
}) {
    return (
        <fieldset className="mt-15 w-full max-w-xl">
            <legend className="mb-4 w-full text-center text-sm text-accent">
              Choose a language to practise
            </legend>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {LANGUAGES.map(({ name, flag }) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => onSelect(name)}
                        className="
                          flex flex-col items-center cursor-pointer gap-2 rounded-xl border px-4 py-4 transition-colors
                          focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary
                          border-border bg-surface text-foreground hover:border-primary
                        "
                    >
                        <Image
                          src={flag}
                          alt=""
                          width={48}
                          height={32}
                          className="h-8 w-12 rounded-sm object-cover"
                        />

                        <span className="text-sm font-medium">
                          {name}
                        </span>
                    </button>
                ))}
            </div>

            <Divider />

            <form
              className="relative mt-5"
              onSubmit={(e) => {
                e.preventDefault()

                const formData = new FormData(e.currentTarget)
                const language = String(formData.get("language") ?? "").trim()

                if (language) {
                  onSelect(language)
                }
              }}
            >
              <input
                name="language"
                className="input_box pr-12"
                placeholder="Another language"
                aria-label="Custom language"
                aria-describedby="language-hint"
              />

              <button
                type="submit"
                aria-label="Submit language"
                className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-primary text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-border disabled:text-accent"
              >
                <SubmitButton />
              </button>
            </form>
        </fieldset>
    );
}

//

export default function Home() {
  const [language, setLanguage] = useState("")

  return (
    <>
      <main className="flex flex-1 flex-col items-center px-6 py-20">
          <h1 className="text-center text-5xl font-bold tracking-tight sm:text-7xl">
            VOICED PARLEY
          </h1>

          <p className="mt-5 max-w-md text-center text-md text-accent">
            Learn languages by having the conversations that matter.
          </p>

          {language ? (
            <SelectScenario language={language} />
          ) : (
            <SelectLanguage onSelect={setLanguage} />
          )}
      </main>
    </>
  )
}
