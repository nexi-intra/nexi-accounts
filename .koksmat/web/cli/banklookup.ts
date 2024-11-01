import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_KNOWLEDGE_GRAPH_API_KEY =
  process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key");
}

// Define the structure of our response
interface BankInfo {
  bank_name: string;
  homepage_url: string;
  logo_url?: string;
  countries_of_operation?: string[];
  number_of_employees?: number;
  core_business_areas?: string[];
}

async function getBankInfo(bankName: string): Promise<BankInfo | null> {
  const prompt = `Provide detailed information about ${bankName}, including:
    1. Homepage URL
    2. Logo URL
    3. Countries of operation
    4. Number of employees
    5. Core business areas.
    Return this as JSON.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const bankInfo = JSON.parse(
      response.data.choices[0].text.trim()
    ) as BankInfo;
    return bankInfo;
  } catch (error) {
    console.error("Error retrieving bank info:", error);
    return null;
  }
}

// Optional: Fetch additional information from Google Knowledge Graph
async function getGoogleKnowledgeInfo(bankName: string): Promise<any> {
  if (!GOOGLE_KNOWLEDGE_GRAPH_API_KEY) {
    console.warn("Google Knowledge Graph API key is missing");
    return null;
  }

  try {
    const response = await axios.get(
      "https://kgsearch.googleapis.com/v1/entities:search",
      {
        params: {
          query: bankName,
          key: GOOGLE_KNOWLEDGE_GRAPH_API_KEY,
          limit: 1,
          indent: true,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving data from Google Knowledge Graph:", error);
    return null;
  }
}

// Main function to get bank info
async function main() {
  const bankName = "Deutsche Bank";
  const bankInfo = await getBankInfo(bankName);

  if (bankInfo) {
    console.log("Bank Info from OpenAI:\n", bankInfo);
  }

  // Optionally get Google Knowledge Graph data
  const googleInfo = await getGoogleKnowledgeInfo(bankName);
  if (googleInfo) {
    console.log("Additional Info from Google Knowledge Graph:\n", googleInfo);
  }
}

main().catch((error) => console.error("Error in main function:", error));
