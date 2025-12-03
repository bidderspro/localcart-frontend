"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { fetchMe } from "@/lib/api"
import { markAuthenticated } from "@/lib/client-auth"
import { pickUserRole } from "@/lib/roles"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const validate = async () => {
      try {
        const me = await fetchMe()
        const role = pickUserRole(me)
        if (!role) {
          router.replace("/auth")
          return
        }
        markAuthenticated(role, me?.id)
        if (role !== "admin") {
          router.replace("/auth/roles/admin")
          return
        }
        setAllowed(true)
      } catch {
        router.replace("/auth")
      }
    }
    void validate()
  }, [router])

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm font-semibold text-slate-700">
          Checking admin access...
        </p>
      </div>
    )
  }

  return <>{children}</>
}
