'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search } from 'lucide-react'

interface SearchToken {
  property: string
  value: string
}

interface Property {
  name: string
  values: string[]
}

interface CustomerSearchFieldProps {
  onSearch: (tokens: SearchToken[], freeText: string) => void
  properties: Property[]
}

export function CustomerSearchFieldComponent({ onSearch, properties = [] }: CustomerSearchFieldProps) {
  const [inputValue, setInputValue] = useState('')
  const [tokens, setTokens] = useState<SearchToken[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [suggestionType, setSuggestionType] = useState<'property' | 'value'>('property')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const parts = inputValue.split(':')
    if (parts.length === 1) {
      // Suggest properties
      setSuggestions(properties
        .map(p => p.name)
        .filter(name => name.toLowerCase().startsWith(inputValue.toLowerCase()))
      )
      setSuggestionType('property')
    } else if (parts.length === 2) {
      // Suggest values for the property
      const [property, value] = parts
      const propertyValues = properties.find(p => p.name.toLowerCase() === property.toLowerCase())?.values || []
      setSuggestions(propertyValues.filter(v => v.toLowerCase().startsWith(value.toLowerCase())))
      setSuggestionType('value')
    }
    setIsOpen(suggestions.length > 0)
  }, [inputValue, properties])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      if (inputValue.includes(':')) {
        const [property, value] = inputValue.split(':')
        if (property && value) {
          setTokens([...tokens, { property, value }])
          setInputValue('')
        }
      } else {
        handleSearch()
      }
    } else if (e.key === 'Backspace' && !inputValue && tokens.length > 0) {
      setTokens(tokens.slice(0, -1))
    }
  }

  const handleSuggestionSelect = (suggestion: string) => {
    if (suggestionType === 'property') {
      setInputValue(`${suggestion}:`)
    } else {
      const [property] = inputValue.split(':')
      setTokens([...tokens, { property, value: suggestion }])
      setInputValue('')
    }
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const removeToken = (index: number) => {
    setTokens(tokens.filter((_, i) => i !== index))
  }

  const handleSearch = () => {
    onSearch(tokens, inputValue)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-2">
        {tokens.map((token, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {token.property}:{token.value}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-4 w-4 p-0"
              onClick={() => removeToken(index)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                className="w-full pl-8"
                placeholder="Search customers (e.g., business_area:tech)"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup heading={suggestionType === 'property' ? 'Search Fields' : 'Suggested Values'}>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      onSelect={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={handleSearch} className="mt-4 w-full">
        Search Customers
      </Button>
    </div>
  )
}