"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchMe, loginEmail, saveTokensFromResponse } from "@/lib/api"
import { markAuthenticated } from "@/lib/client-auth"
import { pickUserRole, routeForRole } from "@/lib/roles"

const emailRegex = /\S+@\S+\.\S+/

export default function EmailLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isEmailValid = emailRegex.test(email.trim())
  const isPasswordValid = password.trim().length >= 6
  const canSubmit = isEmailValid && isPasswordValid

  const statusMessage = useMemo(() => {
    if (!email.trim() || !password.trim()) return ""
    if (!isEmailValid) return "Enter a valid email address."
    if (!isPasswordValid) return "Password must be at least 6 characters."
    return ""
  }, [email, password, isEmailValid, isPasswordValid])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    setError("")
    try {
      const response = await loginEmail({
        email: email.trim(),
        password: password.trim(),
      })

      saveTokensFromResponse(response)

      const me = await fetchMe()
      const user = me ?? response?.user
      if (!user) {
        throw new Error("Unable to load your account profile. Please try again.")
      }
      const role = pickUserRole(user)
      markAuthenticated(role, user.id)

      router.push(routeForRole(role))
    } catch (loginError: any) {
      const message =
        (loginError && typeof loginError === "object" && "message" in loginError
          ? (loginError as { message?: string }).message
          : null) || "Invalid email or password."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f5] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Email login
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-500">
            Access your workspace with your email and password.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing you in..." : "Sign in"}
          </Button>
        </form>

        {error || statusMessage ? (
          <p className="mt-4 text-sm text-rose-600">
            {error || statusMessage}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <Link
            href="/auth/email/forgot-password"
            className="font-semibold text-sky-700 transition hover:text-sky-800"
          >
            Forgot password?
          </Link>
          <Link
            href="/auth/email/register"
            className="font-semibold text-sky-700 transition hover:text-sky-800"
          >
            Create account
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/auth"
            className="text-xs text-slate-500 underline underline-offset-4 transition hover:text-slate-700"
          >
            Back to other methods
          </Link>
        </div>
      </div>
    </div>
  )
}
