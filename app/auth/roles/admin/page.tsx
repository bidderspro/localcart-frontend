"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { markAuthenticated } from "@/lib/client-auth"

const emailRegex = /\S+@\S+\.\S+/

export default function AdminRoleVerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEmailValid = emailRegex.test(email.trim())
  const isCodeValid = code.trim().length >= 6
  const canSubmit = isEmailValid && isCodeValid

  const helper = useMemo(() => {
    if (!email.trim() && !code.trim()) return ""
    if (!isEmailValid) return "Enter a valid admin email."
    if (!isCodeValid) return "Admin access code must be at least 6 characters."
    return ""
  }, [email, code, isEmailValid, isCodeValid])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      setError(helper || "Fill in the required fields.")
      return
    }
    setIsSubmitting(true)
    setError("")
    // TODO: validate admin code via backend
    await new Promise((resolve) => setTimeout(resolve, 700))
    markAuthenticated("admin")
    router.push("/admin/dashboard")
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Admin role
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Verify admin access
          </h1>
          <p className="text-sm text-slate-600">
            Enter your admin email and access code to continue to the admin
            dashboard.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Admin email
            </label>
            <Input
              type="email"
              placeholder="admin@company.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Admin access code
            </label>
            <Input
              type="password"
              placeholder="Enter the code you were given"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Reason / context (optional)
            </label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Add context for your admin access request."
              className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Verifying..." : "Continue to admin"}
          </Button>
        </form>

        {error || helper ? (
          <p className="mt-4 text-sm text-rose-600">{error || helper}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-between text-sm text-slate-700">
          <Link
            href="/auth/roles"
            className="font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
          >
            Back to roles
          </Link>
          <Link
            href="/auth"
            className="font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
          >
            Switch method
          </Link>
        </div>
      </div>
    </div>
  )
}
