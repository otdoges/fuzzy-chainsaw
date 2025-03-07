"use client"

import { motion } from "framer-motion"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const models = [
  { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "anthropic/claude-3-opus", label: "Claude 3 Opus" },
  { value: "meta-llama/llama-3.1-405b-instruct", label: "Llama 3.1 405B" },
  { value: "google/gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "mistralai/mistral-large", label: "Mistral Large" },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedModel ? models.find((model) => model.value === selectedModel)?.label : "Select model..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search models..." />
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>
              <CommandGroup>
                {models.map((model) => (
                  <CommandItem
                    key={model.value}
                    value={model.value}
                    onSelect={(currentValue) => {
                      onModelChange(currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedModel === model.value ? "opacity-100" : "opacity-0")}
                    />
                    {model.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </motion.div>
  )
}

