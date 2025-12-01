"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneIcon } from "@/components/ui/Login/LoginButton"
import { authenticatePhone, setOtpForPhone } from "@/lib/client-auth"

export default function RequestOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [isSending, setIsSending] = useState(false)
  const cleanedDigits = useMemo(
    () => phone.replace(/[^0-9]/g, ""),
    [phone]
  )
  const canSubmit = cleanedDigits.length >= 8

  useEffect(() => {
    const initialPhone = searchParams.get("phone")
    if (initialPhone) {
      setPhone(initialPhone)
    }
  }, [searchParams])

  useEffect(() => {
    if (canSubmit && error) {
      setError("")
    }
  }, [canSubmit, error])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      setError("Enter a valid phone number (at least 8 digits).")
      return
    }
    setIsSending(true)
    setStatus("")
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 300))

    const user = authenticatePhone(phone.trim())
    if (!user) {
      setIsSending(false)
      setError("This phone is not registered. Please register first.")
      return
    }

    const code = `${Math.floor(100000 + Math.random() * 900000)}`
    setOtpForPhone(phone.trim(), code)
    setStatus(`OTP ${code} sent to ${phone.trim()}`)
    router.push(
      `/auth/phone/verify-otp?phone=${encodeURIComponent(phone.trim())}`
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm md:p-9">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Phone login
            </p>
            <h1 className="text-2xl font-semibold leading-tight">
              Send verification code
            </h1>
            <p className="text-sm text-slate-600">
              Enter your phone number to receive a one-time password.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input
              type="tel"
              inputMode="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-12 rounded-[12px] border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-200"
            />

            <Button
              type="submit"
              disabled={!canSubmit || isSending}
              className="group h-14 w-full rounded-[12px] border border-sky-600 bg-sky-600 text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500"
            >
              <span className="mr-2 inline-flex items-center justify-center">
                <PhoneIcon />
              </span>
              {isSending ? "Sending..." : "Send OTP"}
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
            <Link
              href="/auth/phone/register"
              className="font-semibold text-emerald-700 underline underline-offset-4 transition hover:text-emerald-800"
            >
              New here? Register first
            </Link>
            <Link
              href="/auth"
              className="font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
            >
              Back to other methods
            </Link>
          </div>

          {status ? (
            <p className="mt-6 text-center text-sm text-emerald-700">
              {status}
            </p>
          ) : null}
          {error ? (
            <p className="mt-2 text-center text-sm text-rose-600">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
