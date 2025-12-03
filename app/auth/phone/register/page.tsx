"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerUser, setOtpForPhone } from "@/lib/client-auth"

export default function PhoneRegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const cleanedPhoneDigits = useMemo(
    () => phone.replace(/[^0-9]/g, ""),
    [phone]
  )
  const canSubmit = fullName.trim().length >= 2 && cleanedPhoneDigits.length >= 8

  useEffect(() => {
    if (canSubmit && error) {
      setError("")
    }
  }, [canSubmit, error])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      setError("Enter your name and a valid phone number (8+ digits).")
      return
    }
    setIsSubmitting(true)
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 400))

    const result = registerUser({
      id: crypto.randomUUID(),
      name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      role: "admin",
    })

    if (!result.ok) {
      setIsSubmitting(false)
      setError(result.error ?? "Unable to register right now.")
      return
    }

    const code = `${Math.floor(100000 + Math.random() * 900000)}`
    setOtpForPhone(phone.trim(), code)
    router.push(
      `/auth/phone/verify-otp?phone=${encodeURIComponent(phone.trim())}&code=${code}&name=${encodeURIComponent(fullName.trim())}`
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2f5f7] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Phone onboarding
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Register with phone
          </h1>
          <p className="text-sm text-slate-600">
            Create your account and we will verify your number with an OTP.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Full name
              </label>
              <Input
                placeholder="Your name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Phone number
              </label>
              <Input
                type="tel"
                inputMode="tel"
                placeholder="Include country code if needed"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Backup email (optional)
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Preparing verification..." : "Continue to OTP"}
          </Button>
        </form>

        {error ? (
          <p className="mt-4 text-sm text-rose-600">{error}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <Link
            href="/auth/phone/request-otp"
            className="font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Already registered? Get OTP
          </Link>
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
