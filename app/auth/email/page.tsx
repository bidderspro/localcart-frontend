"use client"

import { useRouter } from "next/navigation"

import { LoginCard, MailIcon } from "@/components/ui/Login/LoginButton"

export default function EmailAuthPage() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0F1C] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(67,198,245,0.22),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(124,91,255,0.18),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(52,224,161,0.18),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.06]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <LoginCard
          title="Email Login"
          subtitle="Enter your email to receive a magic link or code"
          options={[
            {
              id: "start-email",
              label: "Send magic link",
              icon: <MailIcon />,
              onClick: () => {
                // TODO: plug in email auth flow
              },
            },
          ]}
          variant="dark"
        />
        <button
          className="mt-4 text-sm text-white/70 underline decoration-white/30 underline-offset-4 transition hover:text-white"
          onClick={() => router.push("/auth")}
        >
          Back to login
        </button>
      </div>
    </div>
  )
}
