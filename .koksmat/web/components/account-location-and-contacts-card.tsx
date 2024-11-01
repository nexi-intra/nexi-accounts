"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComponentDoc } from './component-documentation-hub';

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
}

export interface AccountOverviewProps {
  contacts: Contact[];
  locations: Location[];
  mode: 'view' | 'new' | 'edit';
  className?: string;
  onSave: (mode: 'view' | 'new' | 'edit', contacts: Contact[], locations: Location[]) => void;
}

/**
 * AccountLocationAndContactsCard - A magic component for managing account contacts and locations
 * 
 * This component supports view, new, and edit modes for contacts and locations.
 * It uses state variables with initial values provided by props and updates state when props change.
 * A callback function is called with the current mode and values when saving.
 */
export default function AccountLocationAndContactsCard({
  contacts: initialContacts,
  locations: initialLocations,
  mode: initialMode,
  className = "",
  onSave,
}: AccountOverviewProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [mode, setMode] = useState<'view' | 'new' | 'edit'>(initialMode);
  const [activeTab, setActiveTab] = useState("contacts");

  // Update state when props change
  useEffect(() => {
    setContacts(initialContacts);
    setLocations(initialLocations);
    setMode(initialMode);
  }, [initialContacts, initialLocations, initialMode]);

  const handleSave = () => {
    onSave(mode, contacts, locations);
    if (mode === 'new') {
      setMode('view');
    }
  };

  const ContactsComponent: React.FC = () => (
    <div className="space-y-4">
      {contacts.map((contact, index) => (
        <Card key={contact.id}>
          <CardContent className="p-4">
            {mode === 'view' ? (
              <>
                <h3 className="font-semibold text-lg">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.role}</p>
                <p className="text-sm">{contact.email}</p>
                <p className="text-sm">{contact.phone}</p>
              </>
            ) : (
              <>
                <Label htmlFor={`name-${index}`}>Name</Label>
                <Input
                  id={`name-${index}`}
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...contacts];
                    newContacts[index].name = e.target.value;
                    setContacts(newContacts);
                  }}
                />
                <Label htmlFor={`role-${index}`}>Role</Label>
                <Input
                  id={`role-${index}`}
                  value={contact.role}
                  onChange={(e) => {
                    const newContacts = [...contacts];
                    newContacts[index].role = e.target.value;
                    setContacts(newContacts);
                  }}
                />
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  id={`email-${index}`}
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...contacts];
                    newContacts[index].email = e.target.value;
                    setContacts(newContacts);
                  }}
                />
                <Label htmlFor={`phone-${index}`}>Phone</Label>
                <Input
                  id={`phone-${index}`}
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...contacts];
                    newContacts[index].phone = e.target.value;
                    setContacts(newContacts);
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      ))}
      {mode === 'new' && (
        <Button onClick={() => setContacts([...contacts, { id: Date.now().toString(), name: '', role: '', email: '', phone: '' }])}>
          Add Contact
        </Button>
      )}
    </div>
  );

  const WorldMapComponent: React.FC = () => (
    <div className="relative">
      <svg viewBox="0 0 1000 500" className="w-full h-auto">
        <path
          d="M150,50 L850,50 L850,450 L150,450 Z"
          fill="#f0f0f0"
          stroke="#ccc"
          strokeWidth="2"
        />
        {locations.map((location) => (
          <g
            key={location.id}
            transform={`translate(${location.coordinates[0]}, ${location.coordinates[1]})`}
          >
            <MapPin className="text-teal-600" size={24} />
            <title>{`${location.name}: ${location.address}`}</title>
          </g>
        ))}
      </svg>
      {mode !== 'view' && (
        <div className="mt-4 space-y-2">
          {locations.map((location, index) => (
            <Card key={location.id}>
              <CardContent className="p-4">
                <Label htmlFor={`location-name-${index}`}>Name</Label>
                <Input
                  id={`location-name-${index}`}
                  value={location.name}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[index].name = e.target.value;
                    setLocations(newLocations);
                  }}
                />
                <Label htmlFor={`location-address-${index}`}>Address</Label>
                <Input
                  id={`location-address-${index}`}
                  value={location.address}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[index].address = e.target.value;
                    setLocations(newLocations);
                  }}
                />
                <Label htmlFor={`location-coordinates-${index}`}>Coordinates</Label>
                <Input
                  id={`location-coordinates-${index}`}
                  value={location.coordinates.join(', ')}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[index].coordinates = e.target.value.split(',').map(Number) as [number, number];
                    setLocations(newLocations);
                  }}
                />
              </CardContent>
            </Card>
          ))}
          {mode === 'new' && (
            <Button onClick={() => setLocations([...locations, { id: Date.now().toString(), name: '', address: '', coordinates: [0, 0] }])}>
              Add Location
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className={`w-full min-w-[500px] ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="p-4">
          <ContactsComponent />
        </TabsContent>
        <TabsContent value="map" className="p-4">
          <WorldMapComponent />
        </TabsContent>
      </Tabs>
      {mode !== 'view' && (
        <div className="p-4">
          <Button onClick={handleSave}>Save</Button>
        </div>
      )}
    </Card>
  );
}

// Example documentation
export const examplesAccountLocationAndContactsCard: ComponentDoc[] = [
  {
    id: 'AccountLocationAndContactsCard-view',
    name: 'AccountLocationAndContactsCard (View Mode)',
    description: 'A component for viewing account contacts and locations.',
    usage: `
    <AccountLocationAndContactsCard
      contacts={[
        { id: '1', name: 'John Doe', role: 'Manager', email: 'john@example.com', phone: '123-456-7890' }
      ]}
      locations={[
        { id: '1', name: 'Headquarters', address: '123 Main St, City', coordinates: [500, 250] }
      ]}
      mode="view"
      onSave={(mode, contacts, locations) => console.log(mode, contacts, locations)}
    />
    `,
    example: (
      <AccountLocationAndContactsCard
        contacts={[
          { id: '1', name: 'John Doe', role: 'Manager', email: 'john@example.com', phone: '123-456-7890' }
        ]}
        locations={[
          { id: '1', name: 'Headquarters', address: '123 Main St, City', coordinates: [500, 250] }
        ]}
        mode="view"
        onSave={(mode, contacts, locations) => console.log(mode, contacts, locations)}
      />
    ),
  },
  {
    id: 'AccountLocationAndContactsCard-edit',
    name: 'AccountLocationAndContactsCard (Edit Mode)',
    description: 'A component for editing account contacts and locations.',
    usage: `
    <AccountLocationAndContactsCard
      contacts={[
        { id: '1', name: 'John Doe', role: 'Manager', email: 'john@example.com', phone: '123-456-7890' }
      ]}
      locations={[
        { id: '1', name: 'Headquarters', address: '123 Main St, City', coordinates: [500, 250] }
      ]}
      mode="edit"
      onSave={(mode, contacts, locations) => console.log(mode, contacts, locations)}
    />
    `,
    example: (
      <AccountLocationAndContactsCard
        contacts={[
          { id: '1', name: 'John Doe', role: 'Manager', email: 'john@example.com', phone: '123-456-7890' }
        ]}
        locations={[
          { id: '1', name: 'Headquarters', address: '123 Main St, City', coordinates: [500, 250] }
        ]}
        mode="edit"
        onSave={(mode, contacts, locations) => console.log(mode, contacts, locations)}
      />
    ),
  },
  {
    id: 'AccountLocationAndContactsCard-new',
    name: 'AccountLocationAndContactsCard (New Mode)',
    description: 'A component for adding new account contacts and locations.',
    usage: `
    <AccountLocationAndContactsCard
      contacts={[]}
      locations={[]}
      mode="new"
      onSave={(mode, contacts, locations) => console.log(mode, contacts, locations)}
    />
    `,
    example: (
      <AccountLocationAndContactsCard
        contacts={[]}
        locations={[]}
        mode="new"
        onSave={(mode, contacts, locations) => console.log(mode, contacts, locations)}
      />
    ),
  },
];