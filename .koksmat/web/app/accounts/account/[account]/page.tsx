"use client";
import { accounts } from "@/app/api/entity/data";
import { Account } from "@/app/api/entity/schemas";
import AccountLocationAndContactsCard, {
  Contact,
  Location,
} from "@/components/account-location-and-contacts-card";
import AccountDisplay from "@/components/bank-info-display";
import MainAccountCard from "@/components/main-account-card";
import OpenStreetMap from "@/components/map-of-europe";
import { SimpleAccountSearchComponent } from "@/components/simple-account-search";
import TwoPanelWithToc from "@/components/two-panel-with-toc";
import { Skeleton } from "@/components/ui/skeleton";


const exampleAccount: Account = {
  name: "DNB BANK ASA",
  logo: "/placeholder.svg",
  description: "DNB is Norway's largest financial services group and one of the largest in the Nordic region.",
  customerType: "Digital Processing / Licensing / VAS / Scheme Network",
  servicedMarkets: ["NO", "SE", "DK"],
  contract: "Protected Link (Services, SLAs, Vendors, etc.)",
  solution: "Protect Link",
  compliance: {
    gdpr: "Protected Link",
    dora: "Protected Link",
    pci: "Protected Link"
  },
  id: 1,
  createdAt: new Date(),
  createdBy: "",
  updatedAt: new Date(),
  updatedBy: "",
  deletedAt: null,
  deletedBy: null
}

// View mode

import React, { use, useEffect, useState } from "react";

export default function Page(prop: { params: { account: string } }) {
  const { account } = prop.params
  const [item, setitem] = useState<Account | null>(null)
  useEffect(() => {
    if (prop.params.account) {
      const id = parseInt(account)

      setitem(accounts.find((item) => item.id === id) || null)
    }
  }, [account])

  const examplePanels = [
    {
      key: 'panel1', title: 'Panel 1', content: <div>
        {item &&
          <AccountDisplay
            info={item}
            mode="view"
            onUpdate={(mode, info) => console.log(mode, info)}
          />
        }
      </div>
    },
    {
      key: 'panel2',
      title: 'Map',
      content: (
        <div className="space-y-2">
          <OpenStreetMap
            mode="view"
            initialCenter={[50.0, 10.0]}
            initialZoom={4}
            highlightedCountries={['denmark', 'austria']}
            onModeChange={(mode, center, zoom, highlighted) => {
              console.log('Mode:', mode);
              console.log('Center:', center);
              console.log('Zoom:', zoom);
              console.log('Highlighted countries:', highlighted);
            }}
          />
        </div>
      )
    }
  ]
  return (
    <div>

      <TwoPanelWithToc>
        {examplePanels.map(panel => (
          <div key={panel.key} title={panel.title}>

            {typeof panel.content === 'string' ? <p>{panel.content}</p> : panel.content}
          </div>
        ))}
      </TwoPanelWithToc></div>
  );
}
