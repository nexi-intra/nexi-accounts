'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ComponentDoc } from './component-documentation-hub'

interface LandingPageProps {
  className?: string
  defaultMode?: 'view' | 'new' | 'edit'
  onModeChange?: (mode: 'view' | 'new' | 'edit', values: { title: string; description: string }) => void
}

export function LandingPage({
  className = '',
  defaultMode = 'view',
  onModeChange
}: LandingPageProps) {
  const [mode, setMode] = useState(defaultMode)

  // Update callback when mode changes
  useEffect(() => {
    onModeChange?.(mode, {
      title: 'Welcome to Account Info',
      description: 'Proof of concept for managing your account information'
    })
  }, [mode, onModeChange])

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-8 ${className}`}>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Account Info</h1>
        <p className="text-xl text-muted-foreground">
          A proof of concept for modern account management
        </p>
      </div>

      <Card className="border-2">
        <CardContent className="p-6 space-y-6">
          <div className="relative w-full h-64">
            <Image
              src="/dnb.png"
              alt="World map showing office locations"
              fill
              className="object-contain"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Key Benefits</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Global reach across 33+ countries</li>
                <li>✓ Established presence with offices in 25 countries</li>
                <li>✓ Serving 222+ contracted issuers</li>
                <li>✓ Comprehensive digital processing solutions</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Service Coverage</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Markets:</strong> NO, SE, DK</p>
                <p><strong>Solutions:</strong> Protected Link Services</p>
                <p><strong>Compliance:</strong> GDPR, DORA, PCI compliant</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button onClick={() => setMode('view')} variant={mode === 'view' ? 'default' : 'outline'}>
          View
        </Button>
        <Button onClick={() => setMode('new')} variant={mode === 'new' ? 'default' : 'outline'}>
          New
        </Button>
        <Button onClick={() => setMode('edit')} variant={mode === 'edit' ? 'default' : 'outline'}>
          Edit
        </Button>
      </div>

      {mode !== 'view' && (
        <p className="text-sm text-muted-foreground text-center">
          Note: New and Edit modes are not implemented in this POC.
        </p>
      )}
    </div>
  )
}

// Examples using ComponentDoc
export const examplesLandingPage: ComponentDoc[] = [
  {
    id: 'LandingPage-default',
    name: 'LandingPage - Default View',
    description: 'The default view of the LandingPage component showing benefits and global reach.',
    usage: `
<LandingPage
  onModeChange={(mode, values) => console.log(mode, values)}
/>
    `,
    example: (
      <LandingPage
        onModeChange={(mode, values) => console.log(mode, values)}
      />
    ),
  }
]