"use client"

import {
  GoogleIcon,
  LoginCard,
  MailIcon,
  PhoneIcon,
  type LoginOption,
} from "@/components/ui/Login/LoginButton"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  const loginOptions: LoginOption[] = [
    {
      id: "google",
      label: "Continue with Google",
      icon: <GoogleIcon />,
      onClick: () => {
        // Redirect to your OAuth callback endpoint
        window.location.href = "/api/auth/google/callback"
      },
    },
    {
      id: "phone",
      label: "Continue with phone number",
      icon: <PhoneIcon />,
      onClick: () => router.push("/auth/phone"),
    },
    {
      id: "email",
      label: "Continue with email",
      icon: <MailIcon />,
      onClick: () => router.push("/auth/email"),
    },
  ]

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0F1C] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(67,198,245,0.28),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(124,91,255,0.22),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(52,224,161,0.22),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.06]" />
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-70"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <LoginCard
          title="Login"
          subtitle="Choose how you want to sign in"
          options={loginOptions}
          variant="dark"
        />
      </div>
    </div>
  )
}
