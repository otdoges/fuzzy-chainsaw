"use client"

import { motion } from "framer-motion"

export function Loader() {
  return (
    <motion.div className="flex space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="h-3 w-3 rounded-full bg-primary"
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: dot * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}

