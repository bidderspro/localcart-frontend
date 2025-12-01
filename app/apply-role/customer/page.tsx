"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CustomerApplicationPage() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = fullName.trim() && phone.trim().length >= 8

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    // TODO: send customer application payload
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-10 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Customer role
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Set up your customer account
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Share a few details so we can personalize your experience.
            </p>
          </div>
          <Link
            href="/apply-role"
            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Back to role selection
          </Link>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Full name
              </label>
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Phone number
              </label>
              <Input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Include country code if needed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Preferences (optional)
            </label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Tell us what you shop for most often."
              className="min-h-[120px] w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full md:w-auto"
          >
            {submitted ? "Submitted" : "Submit application"}
          </Button>
        </form>

        {submitted ? (
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
            Thanks! Your customer profile has been recorded. You can start using
            the app while we finish setup.
          </div>
        ) : null}
      </div>
    </div>
  )
}
