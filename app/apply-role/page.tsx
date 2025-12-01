import Link from "next/link"

const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "Shop and track orders with ease.",
    href: "/apply-role/customer",
  },
  {
    id: "vendor",
    title: "Vendor",
    description: "List products, manage inventory, and get paid.",
    href: "/apply-role/vendor",
  },
  {
    id: "rider",
    title: "Rider",
    description: "Deliver orders and manage your schedule.",
    href: "/apply-role/rider",
  },
]

export default function ApplyRolePage() {
  return (
    <div className="min-h-screen bg-white px-4 py-14 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Choose your workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight">
              Tell us how you want to use LocalCart
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Pick a role to complete the minimal onboarding so we can tailor
              the dashboard for you.
            </p>
          </div>
          <Link
            href="/auth"
            className="text-sm font-semibold text-sky-700 underline underline-offset-4 transition hover:text-sky-900"
          >
            Back to authentication
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={role.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{role.title}</h2>
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 transition group-hover:translate-x-1">
                  Select →
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{role.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
