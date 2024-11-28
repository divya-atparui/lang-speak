"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApiKey } from '@/context/ApiKeyContext'
import { MdKey, MdVisibility, MdVisibilityOff } from 'react-icons/md'

export function ApiKeyInput() {
  const { apiKey, setApiKey, clearApiKey } = useApiKey()
  const [inputKey, setInputKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputKey.trim()) {
      setApiKey(inputKey.trim())
      setInputKey('')
    }
  }

  if (apiKey) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
        <MdKey className="w-4 h-4" />
        <span>API Key: {showKey ? apiKey : '••••••••••••••••'}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? (
            <MdVisibilityOff className="w-4 h-4" />
          ) : (
            <MdVisibility className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearApiKey}
          className="ml-2 text-destructive hover:text-destructive"
        >
          Remove
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="password"
        value={inputKey}
        onChange={(e) => setInputKey(e.target.value)}
        placeholder="Enter your OpenAI API key"
        className="flex-1"
      />
      <Button type="submit" disabled={!inputKey.trim()}>
        Save Key
      </Button>
    </form>
  )
}
