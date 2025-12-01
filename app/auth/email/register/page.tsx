"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { markAuthenticated, registerUser } from "@/lib/client-auth"

const emailRegex = /\S+@\S+\.\S+/

export default function EmailRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const passwordsMatch =
    password.trim().length >= 6 && password === confirmPassword
  const isEmailValid = emailRegex.test(email.trim())
  const canSubmit =
    name.trim().length >= 2 && isEmailValid && passwordsMatch

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 400))
    const result = registerUser({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      password,
      role: "admin",
    })

    if (!result.ok) {
      setIsSubmitting(false)
      setError(result.error ?? "Unable to register right now.")
      return
    }

    markAuthenticated("admin")
    router.push("/auth/roles")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f5] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Email onboarding
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">
            We will verify your email after sign up.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Full name
              </label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email
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
                Password
              </label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Confirm password
              </label>
            <Input
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {!passwordsMatch && confirmPassword ? (
              <p className="text-xs text-rose-500">
                Passwords must match and be at least 6 characters.
              </p>
            ) : null}
          </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <Link
            href="/auth/email/login"
            className="font-semibold text-slate-700 underline underline-offset-4 transition hover:text-slate-900"
          >
            Already have an account?
          </Link>
          <Link
            href="/auth"
            className="font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Other methods
          </Link>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-rose-600">{error}</p>
        ) : null}
      </div>
    </div>
  )
}
