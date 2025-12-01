"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RiderApplicationPage() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = fullName.trim() && phone.trim().length >= 8 && city.trim()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    // TODO: send rider application payload
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-10 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Rider role
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Apply to deliver with us
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Provide your details so we can verify and activate your rider
              access.
            </p>
          </div>
          <Link
            href="/apply-role"
            className="text-sm font-semibold text-indigo-700 transition hover:text-indigo-800"
          >
            Back to role selection
          </Link>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Full name
              </label>
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your legal name"
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
                placeholder="Include country code"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                City
              </label>
              <Input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Where you will operate"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Vehicle type
              </label>
              <Input
                value={vehicleType}
                onChange={(event) => setVehicleType(event.target.value)}
                placeholder="Bike, scooter, car, etc."
              />
            </div>
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
          <div className="mt-6 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700">
            Application received. We will review your documents and notify you
            when you can start accepting deliveries.
          </div>
        ) : null}
      </div>
    </div>
  )
}
