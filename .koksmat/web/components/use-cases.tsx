'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Globe, List, Search, Users, Shield, Star, Zap, Compass, Github } from 'lucide-react'
import Link from 'next/link'
import { ComponentDoc } from './component-documentation-hub'

/**
 * UseCases
 * 
 * A component that displays the use cases for the Magic Links platform
 * in an interactive card-based layout. Each use case includes a link to a GitHub issue.
 */

interface UseCase {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  githubIssueUrl: string
}

const useCases: UseCase[] = [
  {
    id: 1,
    title: "Proof of Concept",
    description: "Demonstrate the presentation of accounts based on data maintained in an Excel sheet",
    icon: <Globe className="h-6 w-6" />,
    githubIssueUrl: "https://github.com/orgs/nexi-intra/projects/19/views/1?pane=issue&itemId=85191335&issue=nexi-intra%7Cnexi-accounts%7C2"
  },

]

interface UseCasesProps {
  className?: string
}

export default function UseCases({ className = '' }: UseCasesProps) {
  const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({})

  const toggleOpen = (id: number) => {
    setOpenStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className={`container mx-auto p-4 ${className}`}>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <Card key={useCase.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {useCase.icon}
                <span>{useCase.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Collapsible open={openStates[useCase.id]} onOpenChange={() => toggleOpen(useCase.id)}>
                <CardDescription className="mb-2">
                  {useCase.description.slice(0, 100)}
                  {useCase.description.length > 100 && '...'}
                </CardDescription>
                <CollapsibleContent>
                  <CardDescription>
                    {useCase.description.slice(100)}
                  </CardDescription>
                </CollapsibleContent>
                {useCase.description.length > 100 && (
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openStates[useCase.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle use case description</span>
                    </Button>
                  </CollapsibleTrigger>
                )}
              </Collapsible>
            </CardContent>
            <CardFooter>
              <Link href={useCase.githubIssueUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  View GitHub Issue
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const examplesUseCases: ComponentDoc[] = [
  {
    id: 'UseCases',
    name: 'UseCases',
    description: 'A component that displays the use cases for the Magic Links platform in an interactive card-based layout. Each use case includes a link to a GitHub issue.',
    usage: `
import UseCases from './UseCases'

function App() {
  return (
    <UseCases className="my-custom-class" />
  )
}
`,
    example: (
      <UseCases className="max-w-4xl" />
    ),
  }
]