"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useSearchParams } from "next/navigation"

import {
  apiFetch,
  fetchMe,
  getApiBaseUrl,
  saveTokensFromResponse,
} from "@/lib/api"
import { markAuthenticated } from "@/lib/client-auth"
import { pickUserRole, routeForRole } from "@/lib/roles"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    const complete = async () => {
      try {
        const query = searchParams.toString()
        const path = `/auth/google/callback${query ? `?${query}` : ""}`
        const response = await apiFetch<any>(`${getApiBaseUrl()}${path}`)

        saveTokensFromResponse(response)

        const me = await fetchMe()
        const user = me ?? response?.user
        if (!user) {
          throw new Error("Unable to load your account profile. Please try again.")
        }
        const role = pickUserRole(user)
        markAuthenticated(role, user.id)

        setStatus("success")
        router.push(routeForRole(role))
      } catch (err: any) {
        const message =
          (err && typeof err === "object" && "message" in err
            ? (err as { message?: string }).message
            : null) ||
          "Unable to complete Google sign-in."
        setError(message)
        setStatus("loading")
      }
    }
    void complete()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Google authentication
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            {status === "loading" ? "Signing you in..." : "Success"}
          </h1>
          <p className="text-sm text-slate-600">
            {status === "loading"
              ? "Verifying the response from Google."
              : "Redirecting you to finish onboarding."}
          </p>

          <div className="mt-4 flex items-center justify-center">
            <span className="relative inline-flex h-12 w-12 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-200/60" />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">
                G
              </span>
            </span>
          </div>
          {error ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : null}
        </div>

        <div className="mt-6 text-center text-sm text-slate-700">
          <Link
            href="/auth"
            className="font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
          >
            Return to login options
          </Link>
        </div>
      </div>
    </div>
  )
}
