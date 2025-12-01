"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canSubmit = email.trim()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    // TODO: call password reset endpoint
    await new Promise((resolve) => setTimeout(resolve, 700))
    setSent(true)
    setIsSubmitting(false)
  }

  const handleReturn = () => {
    router.push("/auth/email/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f5] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Password reset
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Forgotten password
          </h1>
          <p className="text-sm text-slate-500">
            We will email you a link to set a new password.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Account email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>

        {sent ? (
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
            Reset link sent! Check your inbox to continue.
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <button
            type="button"
            onClick={handleReturn}
            className="font-semibold text-amber-700 transition hover:text-amber-800"
          >
            Back to login
          </button>
          <Link
            href="/auth"
            className="font-semibold text-slate-700 transition hover:text-slate-900"
          >
            Other methods
          </Link>
        </div>
      </div>
    </div>
  )
}
