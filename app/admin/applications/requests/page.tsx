import Link from "next/link"

type Request = {
  id: string
  applicant: string
  role: "vendor" | "rider" | "customer"
  submittedAt: string
  status: "pending" | "approved" | "rejected"
}

const requests: Request[] = [
  {
    id: "req-1024",
    applicant: "Green Market",
    role: "vendor",
    submittedAt: "2025-12-01",
    status: "pending",
  },
  {
    id: "req-1025",
    applicant: "Dayo Adedeji",
    role: "rider",
    submittedAt: "2025-11-30",
    status: "approved",
  },
  {
    id: "req-1026",
    applicant: "Laura Shen",
    role: "customer",
    submittedAt: "2025-11-30",
    status: "pending",
  },
]

const statusStyles: Record<Request["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
}

export default function AdminRequestsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Role applications
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review and approve requests submitted by customers, vendors, and
              riders.
            </p>
          </div>
          <Link
            href="/apply-role"
            className="text-sm font-semibold text-slate-700 underline underline-offset-4 transition hover:text-slate-900"
          >
            Back to onboarding
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-4 gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Applicant</span>
            <span>Role</span>
            <span>Submitted</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.map((request) => (
              <div
                key={request.id}
                className="grid grid-cols-4 items-center gap-4 px-6 py-4 text-sm text-slate-800"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{request.applicant}</p>
                  <p className="text-xs text-slate-500">{request.id}</p>
                </div>
                <div className="capitalize">{request.role}</div>
                <div className="text-slate-600">{request.submittedAt}</div>
                <div className="flex items-center justify-end gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                  >
                    {request.status}
                  </span>
                  <Link
                    href={`/admin/applications/requests/${request.id}`}
                    className="text-sm font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-800"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
