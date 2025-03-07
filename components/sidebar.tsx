"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Code, MessageSquare, FileCode, Braces, Home } from "lucide-react"

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code-generation",
    color: "text-violet-500",
  },
  {
    label: "Chat",
    icon: MessageSquare,
    href: "/chat",
    color: "text-pink-700",
  },
  {
    label: "Code Explanation",
    icon: FileCode,
    href: "/code-explanation",
    color: "text-orange-700",
  },
  {
    label: "Code Refactoring",
    icon: Braces,
    href: "/code-refactoring",
    color: "text-emerald-500",
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

