
"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

type LoginVariant = "dark" | "light"

export type LoginOption = {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
}

const cardStyles: Record<LoginVariant, string> = {
  dark:
    "border-white/10 bg-white/10 shadow-[0_26px_80px_rgba(0,0,0,0.36)] text-white backdrop-blur-2xl",
  light:
    "border-slate-900/8 bg-white/95 shadow-[0_26px_70px_rgba(15,23,42,0.12)] text-slate-900",
}

const buttonStyles: Record<LoginVariant, string> = {
  dark: "border-white/12 bg-gradient-to-r from-white/10 to-white/5 text-white/90 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(67,198,245,0.25)] focus-visible:ring-[rgba(124,91,255,0.35)]",
  light:
    "border-slate-900/8 bg-gradient-to-r from-white to-slate-50 text-slate-900 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] focus-visible:ring-[rgba(67,198,245,0.25)]",
}

export function LoginButton({
  label,
  icon,
  onClick,
  variant = "dark",
}: LoginOption & { variant?: LoginVariant }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick}
      className={cn(
        "group relative flex h-14 w-full items-center justify-center gap-3 rounded-[18px] border px-4 text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 active:translate-y-0",
        buttonStyles[variant]
      )}
      aria-label={label}
      type="button"
    >
      <span className="size-5 opacity-90 transition-opacity duration-200 group-hover:opacity-100">
        {icon}
      </span>
      <span className="leading-none">{label}</span>
    </motion.button>
  )
}

export function LoginCard({
  title,
  subtitle,
  options,
  variant = "dark",
}: {
  title: string
  subtitle?: string
  options: LoginOption[]
  variant?: LoginVariant
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "w-full max-w-md rounded-[26px] border backdrop-blur-xl",
        "p-7 md:p-8 space-y-6",
        cardStyles[variant]
      )}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              "text-sm",
              variant === "dark" ? "text-white/70" : "text-slate-600"
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * index }}
          >
            <LoginButton {...option} variant={variant} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M21.6 12.23c0-.64-.06-1.25-.17-1.84H12v3.48h5.4a4.61 4.61 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.16Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.24-2.5c-.9.6-2.05.95-3.37.95-2.6 0-4.8-1.76-5.58-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.42 13.89a6 6 0 0 1 0-3.78V7.52H3.06a10 10 0 0 0 0 8.96l3.36-2.59Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.16c1.47 0 2.79.5 3.84 1.48l2.88-2.88A9.98 9.98 0 0 0 12 2 10 10 0 0 0 3.06 7.52l3.36 2.59C7.2 7.92 9.4 6.16 12 6.16Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M16 2.5H8a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-15a2 2 0 0 0-2-2Z" />
      <path d="M9 5.5h6M12 19.5h.01" />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M5 8l7 5 7-5" />
    </svg>
  )
}
