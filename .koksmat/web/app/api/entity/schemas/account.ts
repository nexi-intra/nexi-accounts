import { z } from "zod";
import { SharedAttributes } from "./_shared";
export const AccountSchema = SharedAttributes.extend({
  name: z.string(),
  logo: z.string().url(),
  description: z.string(),
  customerType: z.string(),
  servicedMarkets: z
    .union([
      z.string(), // Single string
      z.array(z.string()), // Array of strings
      z.null(), // Nullable
    ])
    .describe("Serviced markets"),
  contract: z.string(),
  solution: z.string(),
  compliance: z.object({
    gdpr: z.string(),
    dora: z.string(),
    pci: z.string(),
  }),
});
