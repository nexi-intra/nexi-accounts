import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { type ComponentDoc } from "./component-documentation-hub"
import { Account } from "@/app/api/entity/schemas"

interface BankInfoDisplayProps {
  info: Account
  mode?: "view" | "edit" | "new"
  className?: string
  onUpdate?: (mode: "view" | "edit" | "new", info: Account) => void
}

/**
 * AccountDisplay - A component for displaying account information
 * 
 * This component renders account information in a structured format including:
 * - Bank logo and name
 * - Description
 * - Key information in a table format
 * - Compliance information
 * 
 * The component supports view, edit, and new modes with appropriate callbacks
 */
export default function AccountDisplay({
  info,
  mode = "view",
  className = "",
  onUpdate
}: BankInfoDisplayProps) {
  return (
    <Card className={className}>
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-4">
          <Image
            src={info.logo}
            alt={`${info.name} logo`}
            width={100}
            height={40}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold">{info.name}</h1>
        </div>
        <p className="text-muted-foreground">{info.description}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Customer type</TableCell>
              <TableCell>{info.customerType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Serviced Market(s)</TableCell>
              {/* <TableCell>{info?.servicedMarkets!.join(", ")}</TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Contract</TableCell>
              <TableCell>{info.contract}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Solution</TableCell>
              <TableCell>{info.solution}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">GDPR, DORA, PCI</TableCell>
              <TableCell>{info.compliance.gdpr}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p className="mt-4 text-sm text-muted-foreground">
          * Each items inclusion is subject to availability and may vary in form and quality depending on customer and documentation practises across regions
        </p>
      </CardContent>
    </Card>
  )
}

// Inline example account data
const exampleAccount: Account = {
  name: "DNB BANK ASA",
  logo: "/placeholder.svg",
  description: "DNB is Norway's largest financial services group and one of the largest in the Nordic region. Established in 1822, DNB offers a comprehensive range of financial services including corporate banking, retail banking, investment banking, and asset management. The bank serves over 2.3 million retail customers and more than 200,000 corporate clients in Norway.",
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

// Component documentation examples
export const examplesAccountDisplay: ComponentDoc[] = [
  {
    id: "account-info-view",
    name: "AccountDisplay - View Mode",
    description: "Display account information in view mode",
    usage: `
import { AccountDisplay } from './bank-info-display'

const exampleAccount = {
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
  }
}

// View mode
<AccountDisplay 
  info={exampleAccount}
  mode="view"
  onUpdate={(mode, info) => console.log(mode, info)}
/>
    `,
    example: (
      <AccountDisplay
        info={exampleAccount}
        mode="view"
        onUpdate={(mode, info) => console.log(mode, info)}
      />
    )
  }
]