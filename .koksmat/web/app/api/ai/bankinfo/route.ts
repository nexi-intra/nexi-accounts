// app/api/getBankInfo/route.ts

import { NextResponse } from "next/server";
import axios from "axios";
import { jsonrepair } from "jsonrepair";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key");
}

interface BankInfo {
  bank_name: string;
  homepage_url: string;
  logo_url?: string;
  countries_of_operation?: string[];
  number_of_employees?: number;
  core_business_areas?: string[];
}

interface ApiResponse {
  success: boolean;
  data?: BankInfo;
  error?: {
    message: string;
    steps: string[];
    details: any;
    rawData?: string; // Include raw response for diagnostic purposes
  };
  prompt: string;
}

// Function to clean response by removing markdown code blocks or other extraneous characters
function cleanResponseText(responseText: string): string {
  return responseText.replace(/```json|```/g, "").trim();
}

export async function POST(request: Request): Promise<NextResponse> {
  const steps: string[] = ["Received request for bank information"];
  let prompt = "";
  let rawResponse = ""; // Variable to store raw response for debugging

  try {
    const { bankName } = await request.json();
    steps.push("Parsed bank name from request body");

    if (!bankName) {
      steps.push("Validation failed: Bank name is missing");
      return NextResponse.json({
        success: false,
        error: {
          message: "Bank name is required",
          steps,
          details: { missingParameter: "bankName" },
        },
        prompt: prompt, // Empty as prompt was not constructed
      });
    }

    prompt = `Provide detailed information about ${bankName}, including:
      1. Homepage URL
      2. Logo URL
      3. Countries of operation
      4. Number of employees
      5. Core business areas.
      Return this as JSON.`;
    steps.push("Constructed prompt for OpenAI API");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant providing structured information about banks.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    steps.push("Sent request to OpenAI API");

    rawResponse = response.data.choices[0].message.content; // Store raw response
    steps.push("Received response from OpenAI API");

    const cleanData0 = cleanResponseText(rawResponse); // Clean up the response text
    const cleanData = jsonrepair(cleanData0);
    try {
      const bankInfo = JSON.parse(cleanData) as BankInfo;
      steps.push("Parsed JSON data from OpenAI API response");

      return NextResponse.json({
        success: true,
        data: bankInfo,
        prompt: prompt,
      } as ApiResponse);
    } catch (jsonError) {
      steps.push("Failed to parse JSON data from OpenAI response");

      return NextResponse.json({
        success: false,
        error: {
          message: "Failed to parse JSON from OpenAI response",
          steps,
          details: {
            errorMessage:
              jsonError instanceof Error ? jsonError.message : "Unknown error",
            errorStack:
              jsonError instanceof Error
                ? jsonError.stack
                : "No stack trace available",
          },
          rawData: rawResponse, // Include raw data for downstream diagnostics
        },
        prompt: prompt,
      } as ApiResponse);
    }
  } catch (error: any) {
    console.error("Error in bank information retrieval:", error);

    return NextResponse.json({
      success: false,
      error: {
        message: "Failed to retrieve bank information",
        steps,
        details: {
          errorMessage: error.message,
          errorStack: error.stack,
          response: error.response
            ? {
                status: error.response.status,
                data: error.response.data,
              }
            : undefined,
        },
      },
      prompt: prompt,
    } as ApiResponse);
  }
}
