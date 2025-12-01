"use client"

import Link from "next/link"

const actions = [
  {
    title: "Email Login",
    description: "Sign in with your credentials.",
    href: "/auth/email/login",
  },
  {
    title: "Create Account",
    description: "Register a new account with email.",
    href: "/auth/email/register",
  },
  {
    title: "Forgot Password",
    description: "Recover access using your email.",
    href: "/auth/email/forgot-password",
  },
]

export default function EmailAuthLanding() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f5] px-4 py-12">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-[0_26px_70px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Email access
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Choose how you want to continue
            </h1>
            <p className="text-sm text-slate-600">
              Log in, register a new account, or recover your password with a
              dedicated flow.
            </p>
          </div>
          <Link
            href="/auth"
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-800"
          >
            Back to other methods
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-slate-200 bg-slate-50/80 p-5 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {action.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{action.description}</p>
              <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-sky-700">
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
  )
}
