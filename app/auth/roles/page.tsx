"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

const roles = [
  {
    id: "vendor",
    title: "Vendor",
    description: "List products and manage inventory.",
    href: "/apply-role/vendor",
  },
  {
    id: "rider",
    title: "Rider",
    description: "Deliver orders and manage schedules.",
    href: "/apply-role/rider",
  },
  {
    id: "customer",
    title: "Customer",
    description: "Shop, track orders, and manage preferences.",
    href: "/apply-role/customer",
  },
]

export default function RoleSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Choose your role
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Where would you like to go?
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Complete a quick role setup to personalize your experience.
            </p>
          </div>
          <Link
            href="/auth"
            className="text-sm font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
          >
            Back to auth options
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => router.push(role.href)}
              className="group h-full rounded-2xl border border-slate-200 bg-white p-5 text-left text-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{role.title}</h2>
                <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 transition group-hover:translate-x-1">
                  Continue
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{role.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
