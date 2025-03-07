"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <motion.div animate={{ rotate: theme === "light" ? 0 : 180 }} transition={{ duration: 0.5, type: "spring" }}>
        {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

