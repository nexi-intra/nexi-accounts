"use client";
import AccountLocationAndContactsCard, {
  Contact,
  Location,
} from "@/components/account-location-and-contacts-card";
import MainAccountCard from "@/components/main-account-card";
import React from "react";

const contacts: Contact[] = [
  {
    name: "Arnt Mykleboste",
    role: "KAM",
    email: "arnt.myklebost@dnb.no",
    phone: "+47 123 45 678",
  },
  {
    name: "Kjetil Løvstad",
    role: "SDM",
    email: "kjetil.lovstad@dnb.no",
    phone: "+47 987 65 432",
  },
];

const locations: Location[] = [
  {
    name: "Head Office",
    address: "Dronning Eufemias gate 30, 0191 Oslo",
    coordinates: [500, 200], // These are approximate SVG coordinates
  },
  {
    name: "DNB Sweden",
    address: "Regeringsgatan 59, 105 88 Stockholm",
    coordinates: [520, 180],
  },
  {
    name: "DNB Denmark",
    address: "Vesterbrogade 1E, 1620 Copenhagen",
    coordinates: [510, 190],
  },
];
const initialGeneralInfo = {
  branches: [
    { name: "DNB Norway", isHQ: true },
    { name: "DNB Sweden", isHQ: false },
    { name: "DNB Denmark", isHQ: false },
  ],
  kam: "Arnt Myklebost",
  sdm: "Kjetil Løvstad",
  sapCustomerId: "Unique Identification of Nets Customers in SAP",
  vatNumber:
    "Unique number that identifies a taxable person, business or non-taxable legal entity",
};

const initialContractInfo = {
  id: "ID",
  description: "Description",
  startDate: "15.02.2010",
  endDate: "15.02.2030",
};
export default function Page() {
  return (
    <div className="w-full">
      {/* Placeholder content */}
      <div className="flex flex-wrap">
        <MainAccountCard
          initialGeneralInfo={initialGeneralInfo}
          initialContractInfo={initialContractInfo}
        />
        <AccountLocationAndContactsCard
          contacts={contacts}
          locations={locations}
        />
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Card</h3>
            <p className="text-sm text-muted-foreground">
              This is a placeholder card for the tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
