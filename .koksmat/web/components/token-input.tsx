'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Token = string | { key: string; value: string }

interface TokenInputProps {
  debug?: boolean
  properties: Array<{
    propertyKeyName: string
    propertyValue: (value: string) => string[]
  }>
  onTokenUpdate: (tokens: Token[]) => void
}

const useTokenInput = (properties: TokenInputProps['properties'], onTokenUpdate: TokenInputProps['onTokenUpdate']) => {
  const [input, setInput] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [mode, setMode] = useState<'empty' | 'capturing' | 'picking'>('empty')
  const [currentProperty, setCurrentProperty] = useState<string | null>(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const parseTokens = useCallback((value: string) => {
    const regex = /[^\s"]+|"([^"]*)"/gi
    const tokens: Token[] = []
    let match
    let isProperty = false
    let propertyKey = ''

    while ((match = regex.exec(value)) !== null) {
      const token = match[1] || match[0]
      if (isProperty) {
        tokens.push({ key: propertyKey, value: token })
        isProperty = false
      } else if (token.endsWith(':')) {
        propertyKey = token.slice(0, -1)
        isProperty = true
      } else {
        tokens.push(token)
      }
    }

    return tokens
  }, [])

  const updateTokens = useCallback((newInput: string, newCursorPosition: number) => {
    const newTokens = parseTokens(newInput)

    // Check if the tokens have actually changed
    const tokensChanged = JSON.stringify(newTokens) !== JSON.stringify(tokens)

    if (tokensChanged) {
      setTokens(newTokens)
      onTokenUpdate(newTokens)
    }

    // Determine the current token based on cursor position
    let currentTokenStart = 0
    let currentTokenEnd = newInput.length
    let isInProperty = false

    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] === ' ' || newInput[i] === '"') {
        if (i < newCursorPosition) {
          currentTokenStart = i + 1
        } else {
          currentTokenEnd = i
          break
        }
      }
      if (newInput[i] === ':') {
        isInProperty = true
        if (i >= newCursorPosition) {
          currentTokenEnd = i
          break
        }
      }
    }

    const currentToken = newInput.slice(currentTokenStart, currentTokenEnd)

    if (currentToken === '') {
      setMode('empty')
      setCurrentProperty(null)
    } else if (isInProperty) {
      setMode('picking')
      setCurrentProperty(newInput.slice(0, currentTokenStart - 1).split(' ').pop() || null)
    } else {
      setMode('capturing')
      setCurrentProperty(null)
    }
  }, [parseTokens, onTokenUpdate, tokens])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value
    const newCursorPosition = e.target.selectionStart || 0
    setInput(newInput)
    setCursorPosition(newCursorPosition)
    updateTokens(newInput, newCursorPosition)
  }, [updateTokens])

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    setCursorPosition(e.currentTarget.selectionStart || 0)
  }, [])

  const handleClick = useCallback(() => {
    setCursorPosition(inputRef.current?.selectionStart || 0)
  }, [])

  useEffect(() => {
    updateTokens(input, cursorPosition)
  }, [cursorPosition, input, updateTokens])

  const suggestions = useMemo(() => {
    const currentTokenStart = input.lastIndexOf(' ', cursorPosition - 1) + 1
    const currentTokenEnd = input.indexOf(' ', cursorPosition)
    const currentToken = input.slice(currentTokenStart, currentTokenEnd > -1 ? currentTokenEnd : undefined).trim()

    if (mode === 'picking' && currentProperty) {
      const property = properties.find(p => p.propertyKeyName === currentProperty)
      return property ? property.propertyValue(currentToken) : []
    } else if (mode === 'capturing') {
      return properties
        .map(p => p.propertyKeyName)
        .filter(p => p.startsWith(currentToken) && p !== currentToken)
    }
    return []
  }, [mode, currentProperty, properties, input, cursorPosition])

  return { input, tokens, mode, currentProperty, handleInputChange, handleKeyUp, handleClick, suggestions, inputRef }
}

export default function InputToken({ debug = false, properties, onTokenUpdate }: TokenInputProps) {
  const { input, tokens, mode, currentProperty, handleInputChange, handleKeyUp, handleClick, suggestions, inputRef } = useTokenInput(properties, onTokenUpdate)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tokenInput">Token Input</Label>
        <Input
          id="tokenInput"
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          placeholder="Enter tokens and properties..."
          className="w-full"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Suggestions: {suggestions.join(', ')}
        </div>
      )}
      {debug && (
        <div className="p-4 bg-muted rounded-md">
          <h3 className="text-sm font-semibold mb-2">Debug Information</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify({ tokens, mode, currentProperty }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}