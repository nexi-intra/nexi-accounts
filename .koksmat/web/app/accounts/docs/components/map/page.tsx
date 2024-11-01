
//'use client';
export const dynamic = "force-dynamic";
import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesOpenStreetMap } from '@/components/map-of-europe';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesOpenStreetMap
  ];
  return <ComponentDocumentationHub components={componentDocs} />;
};
