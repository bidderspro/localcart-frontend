"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"
import { getAuthSession } from "@/lib/client-auth"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const passwordsMatch =
    password.trim().length >= 8 && password.trim() === confirmPassword.trim()
  const canSubmit = email.trim() && passwordsMatch

  const helper = useMemo(() => {
    if (!email.trim()) return ""
    if (!passwordsMatch && confirmPassword) {
      return "Passwords must match and be at least 8 characters."
    }
    return ""
  }, [email, confirmPassword, passwordsMatch])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      const session = getAuthSession()
      if (!session) {
        throw new Error("You must be signed in to reset your password.")
      }

        await apiFetch("/auth/password/reset", {
          method: "POST",
          requireAuth: true,
          body: { password: password.trim() },
        })
        setSent(true)
      } catch (err: any) {
        const message =
        (err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : null) ||
        "Unable to start password reset. Please sign in again."
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
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

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            New password
          </label>
          <Input
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Confirm new password
          </label>
          <Input
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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

      {helper && !sent ? (
        <div className="mt-4 text-sm text-rose-600">{helper}</div>
      ) : null}

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
