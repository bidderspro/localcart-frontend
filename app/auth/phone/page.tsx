"use client"

import Link from "next/link"

const actions = [
  {
    title: "Request OTP",
    description: "Get a one-time password and log in quickly.",
    href: "/auth/phone/request-otp",
  },
  {
    title: "Register with phone",
    description: "Create your account and verify with your number.",
    href: "/auth/phone/register",
  },
  {
    title: "Verify code",
    description: "Already have a code? Jump straight to verification.",
    href: "/auth/phone/verify-otp",
  },
]

export default function PhoneAuthLanding() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Phone authentication
              </p>
              <h1 className="text-3xl font-semibold leading-tight">
                Choose your next step
              </h1>
              <p className="text-sm text-slate-600">
                Request a one-time password, register a new account, or verify a
                code you already have.
              </p>
            </div>
            <Link
              href="/auth"
              className="text-sm font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
            >
              Back to other methods
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold">{action.title}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {action.description}
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Continue
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
