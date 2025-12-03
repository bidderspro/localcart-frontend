"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { applyForRole } from "@/lib/api"
import { getAuthSession } from "@/lib/client-auth"

export default function VendorApplicationPage() {
  const [businessName, setBusinessName] = useState("")
  const [contactName, setContactName] = useState("")
  const [phone, setPhone] = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = businessName.trim() && contactName.trim() && phone.trim()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    const session = getAuthSession()
    if (!session) {
      setError("Please sign in before applying.")
      return
    }

    setIsSubmitting(true)
    setError("")
    try {
      await applyForRole("vendor", {
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        phone: phone.trim(),
        category: category.trim(),
        notes: notes.trim(),
      })
      setSubmitted(true)
    } catch (err: any) {
      const message =
        (err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : null) || "Unable to submit vendor application."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-10 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Vendor role
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Apply as a vendor
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Tell us about your store so we can review and approve your access.
            </p>
          </div>
          <Link
            href="/apply-role"
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-800"
          >
            Back to role selection
          </Link>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Business name
              </label>
              <Input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Your store"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Contact person
              </label>
              <Input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Who should we talk to?"
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <Input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Groceries, electronics, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Store details (optional)
            </label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Operating hours, delivery coverage, or links."
              className="min-h-[140px] w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Submitting..." : submitted ? "Submitted" : "Submit application"}
          </Button>
        </form>

        {error ? (
          <div className="mt-4 text-sm text-rose-600">{error}</div>
        ) : null}

        {submitted ? (
          <div className="mt-6 rounded-lg bg-sky-50 p-4 text-sm text-sky-700">
            Thanks! Your vendor request is in review. We will notify you when an
            admin approves it.
          </div>
        ) : null}
      </div>
    </div>
  )
}
