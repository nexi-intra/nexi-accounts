import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";

export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Location {
  name: string;
  address: string;
  coordinates: [number, number];
}

export interface AccountOverviewProps {
  contacts: Contact[];
  locations: Location[];
}

const ContactsComponent: React.FC<{ contacts: Contact[] }> = ({ contacts }) => (
  <div className="space-y-4 ">
    {contacts.map((contact, index) => (
      <Card key={index}>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{contact.name}</h3>
          <p className="text-sm text-gray-600">{contact.role}</p>
          <p className="text-sm">{contact.email}</p>
          <p className="text-sm">{contact.phone}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const WorldMapComponent: React.FC<{ locations: Location[] }> = ({
  locations,
}) => (
  <div className="relative">
    <svg viewBox="0 0 1000 500" className="w-full h-auto">
      <path
        d="M150,50 L850,50 L850,450 L150,450 Z"
        fill="#f0f0f0"
        stroke="#ccc"
        strokeWidth="2"
      />
      {locations.map((location, index) => (
        <g
          key={index}
          transform={`translate(${location.coordinates[0]}, ${location.coordinates[1]})`}
        >
          <MapPin className="text-teal-600" size={24} />
          <title>{`${location.name}: ${location.address}`}</title>
        </g>
      ))}
    </svg>
  </div>
);

export default function AccountLocationAndContactsCard({
  contacts,
  locations,
}: AccountOverviewProps) {
  const [activeTab, setActiveTab] = useState("contacts");

  return (
    <Card className="w-full min-w-[500px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="p-4">
          <ContactsComponent contacts={contacts} />
        </TabsContent>
        <TabsContent value="map" className="p-4">
          <WorldMapComponent locations={locations} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
