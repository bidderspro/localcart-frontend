"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneIcon } from "@/components/ui/Login/LoginButton"

export default function PhoneAuthPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<"phone" | "otp">("phone")
  const [phone, setPhone] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [resendTimer, setResendTimer] = React.useState(0)
  const [status, setStatus] = React.useState("")

  React.useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setInterval(() => {
      setResendTimer((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  const isPhoneValid = phone.trim().length >= 8
  const isOtpValid = otp.trim().length >= 4

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPhoneValid) return
    setIsSending(true)
    setStatus("")
    // TODO: replace with real API call to send OTP
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsSending(false)
    setStep("otp")
    setStatus(`OTP sent to ${phone}`)
    setResendTimer(60)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOtpValid) return
    setIsVerifying(true)
    setStatus("")
    // TODO: replace with real API call to verify OTP
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsVerifying(false)
    setStatus("OTP verified. Redirecting...")
    // router.push("/dashboard") // adjust to your post-login route
  }

  const handleResend = async () => {
    if (resendTimer > 0 || !isPhoneValid) return
    setIsSending(true)
    setStatus("")
    // TODO: replace with real resend API call
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsSending(false)
    setStatus(`New OTP sent to ${phone}`)
    setResendTimer(60)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c2337] via-[#0e1730] to-[#06141f] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(67,198,245,0.22),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(124,91,255,0.18),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(52,224,161,0.18),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/8 p-8 text-white shadow-[0_26px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-9">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold leading-tight">Phone Login</h1>
            <p className="text-sm text-white/70">
              {step === "phone"
                ? "Enter your phone to receive a verification code"
                : `Enter the OTP sent to ${phone}`}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {step === "phone" ? (
              <form className="space-y-4" onSubmit={handleSendOtp}>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-[18px] border-white/10 bg-white/5 text-white placeholder:text-white/60 focus-visible:ring-[#5c6ac4]/40"
                />
                <Button
                  type="submit"
                  disabled={!isPhoneValid || isSending}
                  className="group h-14 w-full rounded-[18px] border border-[#4e5fa8] bg-white/5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-all hover:border-[#6d7dd4] hover:bg-white/8 hover:shadow-[0_22px_55px_rgba(0,0,0,0.32)] disabled:border-white/20 disabled:text-white/50"
                >
                  <span className="mr-2 inline-flex items-center justify-center">
                    <PhoneIcon />
                  </span>
                  {isSending ? "Sending..." : "Send verification code"}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-12 rounded-[18px] border-white/10 bg-white/5 text-white placeholder:text-white/60 focus-visible:ring-[#5c6ac4]/40"
                />
                <Button
                  type="submit"
                  disabled={!isOtpValid || isVerifying}
                  className="h-14 w-full rounded-[18px] border border-[#4e5fa8] bg-white/5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-all hover:border-[#6d7dd4] hover:bg-white/8 hover:shadow-[0_22px_55px_rgba(0,0,0,0.32)] disabled:border-white/20 disabled:text-white/50"
                >
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </Button>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>
                    {resendTimer > 0
                      ? `Resend in 0:${String(resendTimer).padStart(2, "0")}`
                      : "Didn't receive the code?"}
                  </span>
                  <button
                    type="button"
                    className="font-medium text-white hover:text-white/90 disabled:cursor-not-allowed disabled:text-white/40"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || isSending}
                  >
                    Resend
                  </button>
                </div>
              </form>
            )}

            {status ? (
              <p className="text-center text-sm text-emerald-200/80">{status}</p>
            ) : null}
          </div>

          <button
            className="mt-8 block w-full text-center text-sm text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-white"
            onClick={() => router.push("/auth")}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  )
}
