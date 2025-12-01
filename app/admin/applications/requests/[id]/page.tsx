"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type RequestDetail = {
  id: string
  applicant: string
  role: "vendor" | "rider" | "customer"
  submittedAt: string
  summary: string
}

const mockRequests: Record<string, RequestDetail> = {
  "req-1024": {
    id: "req-1024",
    applicant: "Green Market",
    role: "vendor",
    submittedAt: "2025-12-01",
    summary: "Grocery store seeking to list fresh produce and pantry staples.",
  },
  "req-1025": {
    id: "req-1025",
    applicant: "Dayo Adedeji",
    role: "rider",
    submittedAt: "2025-11-30",
    summary: "Experienced courier with motorbike, prefers evening shifts.",
  },
  "req-1026": {
    id: "req-1026",
    applicant: "Laura Shen",
    role: "customer",
    submittedAt: "2025-11-30",
    summary: "Customer signup requesting early access perks.",
  },
}

const statusBadge = {
  approve: "bg-emerald-100 text-emerald-800",
  reject: "bg-rose-100 text-rose-800",
}

export default function ApplicationReviewPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const request = useMemo(
    () => mockRequests[params.id] ?? mockRequests["req-1024"],
    [params.id]
  )
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDecision = async (value: "approve" | "reject") => {
    setDecision(value)
    setIsSubmitting(true)
    // TODO: send decision to backend
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsSubmitting(false)
  }

  const handleBack = () => router.push("/admin/applications/requests")

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Admin review
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {request.applicant}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {request.role} - Submitted {request.submittedAt}
            </p>
          </div>
          <Link
            href="/admin/applications/requests"
            className="text-sm font-semibold text-slate-700 underline underline-offset-4 transition hover:text-slate-900"
          >
            Back to list
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Request id
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {request.id}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </p>
              <p className="text-lg font-semibold capitalize text-slate-900">
                {request.role}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Summary
              </p>
              <p className="text-sm text-slate-700">{request.summary}</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-sm font-semibold text-slate-800">
              Internal notes
            </p>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add context for other admins before approving or rejecting."
              className="min-h-[140px] w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                placeholder="Attach document URL (optional)"
                className="md:col-span-2"
              />
              <Button
                variant="secondary"
                onClick={handleBack}
                className="w-full"
              >
                Save as draft
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleDecision("reject")}
              >
                Reject
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => handleDecision("approve")}
              >
                {isSubmitting && decision === "approve"
                  ? "Approving..."
                  : "Approve"}
              </Button>
            </div>
            {decision ? (
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${statusBadge[decision]}`}
              >
                Marked as {decision}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
