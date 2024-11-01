'use client';



import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InputToken = dynamic(() => import('@/components/token-input'), { ssr: false });
const SearchTokenEditor = dynamic(
  () => import('@/components/advanced-search-field').then((mod) => mod.default),
  { ssr: false }
);

const colorSuggestions = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];
const sizeSuggestions = ['small', 'medium', 'large', 'x-large', 'xx-large'];
const shapeSuggestions = ['circle', 'square', 'triangle', 'rectangle', 'oval', 'hexagon'];

export default function TokenInputExample() {
  const [tokens, setTokens] = useState<Array<string | { key: string; value: string }>>([]);

  const properties = [
    {
      propertyKeyName: 'color',
      propertyValue: (value: string) => colorSuggestions.filter(c => c.toLowerCase().includes(value.toLowerCase())),
    },
    {
      propertyKeyName: 'size',
      propertyValue: (value: string) => sizeSuggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())),
    },
    {
      propertyKeyName: 'shape',
      propertyValue: (value: string) => shapeSuggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())),
    },
  ];

  const handleTokenUpdate = (newTokens: Array<string | { key: string; value: string }>) => {
    setTokens(newTokens);
    console.log('Tokens updated:', newTokens);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Input Example</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchTokenEditor
          initialData=""
          onUpdate={handleTokenUpdate}
          properties={[
            { name: 'color', values: colorSuggestions },
            { name: 'drink', values: ['water', 'coffee', 'tea with milk', 'soda', 'juice', 'beer', 'wine', 'milk', 'smoothie', 'cocktail'] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
