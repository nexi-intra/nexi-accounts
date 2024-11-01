

'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesAccountLocationAndContactsCard } from '@/components/account-location-and-contacts-card';
import { examplesAccountDisplay } from '@/components/bank-info-display';






// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesAccountDisplay
  ];
  return <ComponentDocumentationHub components={componentDocs} />;
};

