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
      onClick: () => router.push("/auth/google/callback"),
    },
    {
      id: "phone",
      label: "Continue with phone number",
      icon: <PhoneIcon />,
      onClick: () => router.push("/auth/phone/request-otp"),
    },
    {
      id: "email",
      label: "Continue with email",
      icon: <MailIcon />,
      onClick: () => router.push("/auth/email/login"),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-16 md:px-8 md:py-20">
        <div className="w-full max-w-xl">
          <LoginCard
            title="Login"
            subtitle="Pick a secure method to access your workspace"
            options={loginOptions}
            variant="light"
          />
        </div>
      </div>
    </div>
  )
}
