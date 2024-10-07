import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Branch {
  name: string;
  isHQ: boolean;
}

interface GeneralInfo {
  branches: Branch[];
  kam: string;
  sdm: string;
  sapCustomerId: string;
  vatNumber: string;
}

interface ContractInfo {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface MainAccountCardProps {
  initialGeneralInfo: GeneralInfo;
  initialContractInfo: ContractInfo;
}

export default function MainAccountCard({
  initialGeneralInfo,
  initialContractInfo,
}: MainAccountCardProps) {
  const [generalInfo, setGeneralInfo] =
    useState<GeneralInfo>(initialGeneralInfo);
  const [contractInfo, setContractInfo] =
    useState<ContractInfo>(initialContractInfo);

  useEffect(() => {
    setGeneralInfo(initialGeneralInfo);
    setContractInfo(initialContractInfo);
  }, [initialGeneralInfo, initialContractInfo]);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold text-teal-600">DNB</div>
          <div>
            <CardTitle className="text-2xl">DNB BANK ASA</CardTitle>
            <p className="text-sm text-gray-500">High level strategy</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold">General</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Branches:</dt>
                <dd className="text-right">
                  {generalInfo.branches.map((branch, index) => (
                    <React.Fragment key={branch.name}>
                      <span className="font-semibold text-teal-600">
                        {branch.name}
                      </span>
                      {branch.isHQ && " (HQ)"}
                      {index < generalInfo.branches.length - 1 && ", "}
                    </React.Fragment>
                  ))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">KAM:</dt>
                <dd>{generalInfo.kam}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">SDM:</dt>
                <dd>{generalInfo.sdm}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">SAP customer ID:</dt>
                <dd>{generalInfo.sapCustomerId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">VAT number:</dt>
                <dd className="text-right">{generalInfo.vatNumber}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contract</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Contract ID:</dt>
                <dd>{contractInfo.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Contract description:</dt>
                <dd>{contractInfo.description}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Contract start date:</dt>
                <dd>{contractInfo.startDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Contract end date:</dt>
                <dd>{contractInfo.endDate}</dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
