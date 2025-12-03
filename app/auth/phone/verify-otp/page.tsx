"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  fetchMe,
  requestPhoneOtp,
  saveTokensFromResponse,
  verifyPhoneOtp,
} from "@/lib/api"
import { markAuthenticated } from "@/lib/client-auth"
import { pickUserRole, routeForRole } from "@/lib/roles"

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneFromQuery = searchParams.get("phone") ?? ""
  const phoneLabel = phoneFromQuery || "your phone"
  const codeFromQuery = searchParams.get("code")
  const nameFromQuery = searchParams.get("name") ?? ""

  const [otp, setOtp] = useState("")
  const [name, setName] = useState(nameFromQuery)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const otpDigits = otp.trim()
  const nameValue = name.trim()
  const canSubmit = otpDigits.length >= 6 && nameValue.length >= 2

  useEffect(() => {
    if (!resendTimer) return
    const timer = setInterval(
      () => setResendTimer((value) => Math.max(value - 1, 0)),
      1000
    )
    return () => clearInterval(timer)
  }, [resendTimer])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      setError("Enter the 6-digit code and your name.")
      return
    }
    setIsVerifying(true)
    setStatus("")
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 400))

    const normalizedPhone = phoneFromQuery.trim()
    if (!normalizedPhone) {
      setIsVerifying(false)
      setError("Missing phone number. Request a new code.")
      return
    }

    try {
      const response = await verifyPhoneOtp({
        phone: normalizedPhone,
        code: otpDigits,
        name: nameValue,
      })

      saveTokensFromResponse(response)

      const me = await fetchMe()
      const user = me ?? response?.user
      if (!user) {
        throw new Error("Unable to load your account profile. Please try again.")
      }
      const role = pickUserRole(user)
      markAuthenticated(role, user.id)

      setStatus(response?.message ?? "OTP verified. Redirecting...")
      router.push(routeForRole(role))
    } catch (error: any) {
      const message =
        (error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message
          : null) || "Unauthorized. Please check the code and try again."
      setError(message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    if (!phoneFromQuery.trim()) {
      setError("Missing phone number. Request a new code.")
      return
    }
    setIsResending(true)
    setStatus("")
    setError("")
    try {
      const response = await requestPhoneOtp(phoneFromQuery.trim())
      setResendTimer(60)
      setStatus(response?.message ?? "A new code was sent to your phone.")
    } catch (error: any) {
      const message =
        (error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message
          : null) || "Unable to resend code right now."
      setError(message)
    } finally {
      setIsResending(false)
    }
  }

  useEffect(() => {
    if (canSubmit && error) {
      setError("")
    }
  }, [canSubmit, error])

  useEffect(() => {
    if (codeFromQuery) {
      setOtp(codeFromQuery)
    }
  }, [codeFromQuery])

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm md:p-9">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Verify OTP
            </p>
            <h1 className="text-2xl font-semibold leading-tight">
              Enter the code we sent
            </h1>
            <p className="text-sm text-slate-600">
              Please type the 6-digit code sent to {phoneLabel}.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/[^0-9]/g, ""))
              }
              className="h-12 rounded-[12px] border-slate-300 bg-white text-center text-xl tracking-[0.6em] text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-200"
            />

            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-[12px] border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-200"
            />

            <Button
              type="submit"
              disabled={!canSubmit || isVerifying}
              className="h-14 w-full rounded-[12px] border border-sky-600 bg-sky-600 text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500"
            >
              {isVerifying ? "Verifying..." : "Verify code"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-700">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || isResending}
              className="font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {resendTimer > 0
                ? `Resend in 0:${String(resendTimer).padStart(2, "0")}`
                : isResending
                  ? "Sending..."
                  : "Resend code"}
            </button>

            <Link
              href="/auth/phone/request-otp"
              className="font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
            >
              Use a different number
            </Link>
          </div>

          {status ? (
            <p className="mt-6 text-center text-sm text-emerald-700">
              {status}
            </p>
          ) : null}
          {error ? (
            <p className="mt-2 text-center text-sm text-rose-600">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
