#!/usr/bin/env pwsh

param (
  [string]$inputFile = "/Users/nielsgregersjohansen/kitchens/nexi-accounts/.koksmat/web/data/accounts.json",
  [string]$outputFile = "/Users/nielsgregersjohansen/kitchens/nexi-accounts/.koksmat/web/data/accounts-out.ts"
)

# Initialize the ID counter
$idCounter = 1

# Function to map an Item to an Account
function Map-ItemToAccount {
  param (
    [Parameter(Mandatory = $true)]
    [PSCustomObject]$Item,
      
    [Parameter(Mandatory = $true)]
    [string]$CurrentUser,

    [Parameter(Mandatory = $true)]
    [int]$Id
  )

  # Split the 'Market(s) serviced by Nexi' string into an array
  $servicedMarkets = $Item.'Market(s) serviced by Nexi' -split ',' | ForEach-Object { $_.Trim() }

  # Create and return the Account object
  $account = [PSCustomObject]@{
    id              = $Id
    name            = $Item.Customer
    logo            = "/placeholder.svg"  # Default logo, can be updated later
    description     = $Item.'customer description'
    customerType    = $Item.'Business Model Served'
    servicedMarkets = $servicedMarkets
    contract        = $Item.'Link to Contract (share)'
    solution        = $Item.'Link to Service / Capability Mapping (Matrix)'
    compliance      = [PSCustomObject]@{
      gdpr = "Protected Link"  # Default value, can be updated later
      dora = $Item.'Link to Vendor/DORA mapping (share)'
      pci  = "Protected Link"  # Default value, can be updated later
    }
    createdAt       = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ss.fffffffZ')
    createdBy       = $CurrentUser
    updatedAt       = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ss.fffffffZ')
    updatedBy       = $CurrentUser
    deletedAt       = $null
    deletedBy       = $null
  }

  return $account
}

# Function to process a JSON file and map all items to accounts
function Process-JsonFile {
  param (
    [Parameter(Mandatory = $true)]
    [string]$FilePath,
      
    [Parameter(Mandatory = $true)]
    [string]$CurrentUser
  )

  # Check if file exists
  if (-not (Test-Path $FilePath)) {
    Write-Error "File not found: $FilePath"
    return
  }

  try {
    # Read and parse the JSON file
    $jsonContent = Get-Content $FilePath -Raw | ConvertFrom-Json

    # Initialize the ID counter
    $script:idCounter = 1

    # Map each item to an account with sequential IDs
    $accounts = $jsonContent | ForEach-Object {
      $account = Map-ItemToAccount -Item $_ -CurrentUser $CurrentUser -Id $script:idCounter
      $script:idCounter++
      $account
    }

    return $accounts
  }
  catch {
    Write-Error "An error occurred while processing the file: $_"
  }
}

# Process the input file
$processedAccounts = Process-JsonFile -FilePath $inputFile -CurrentUser "system"

if ($processedAccounts) {
  # Convert the processed accounts to JSON, ensuring proper formatting
  $accountsJson = $processedAccounts | ConvertTo-Json -Depth 4

  # Remove quotes around array brackets for servicedMarkets
  $accountsJson = $accountsJson -replace '"(\[[^\]]*\])"', '$1'

  # Replace date strings with Date constructors
  $accountsJson = $accountsJson -replace '("(createdAt|updatedAt|deletedAt)"\s*:\s*)"([^"]+)"', '$1 new Date("$3")'

  # Create the TypeScript output
  $tsOutput = @"
import { Account } from "@/app/api/entity/schemas"

export const accounts: Account[] = $accountsJson
"@

  # Write the output to the file
  $tsOutput | Out-File $outputFile -Encoding utf8
  Write-Host "Processed accounts have been written to $outputFile"
}
