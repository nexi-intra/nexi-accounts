"use client";

import { useState, ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ConsumedService = {
  service: string;
};

type CustomerPersona = {
  name: string;
  description: string;
  consumedServices: ConsumedService[];
};

type CustomerPersonasProps = {
  initialPersonas?: CustomerPersona[];
  productOptions?: string[];
};

const ConsumedServices = ({
  services,
  personaIndex,
  updateConsumedService,
}: {
  services: ConsumedService[];
  personaIndex: number;
  updateConsumedService: (
    personaIndex: number,
    serviceIndex: number,
    value: string
  ) => void;
}) => (
  <div>
    <h3 className="font-semibold mb-2">Consumed services:</h3>
    {services.map((service, serviceIndex) => (
      <div key={serviceIndex} className="flex items-center mb-2">
        <span className="w-24">Service:</span>
        <Input
          value={service.service}
          onChange={(e) =>
            updateConsumedService(personaIndex, serviceIndex, e.target.value)
          }
          className="flex-grow"
        />
      </div>
    ))}
  </div>
);

export default function Component({
  initialPersonas = [],
  productOptions = ["Product"],
}: CustomerPersonasProps) {
  const [personas, setPersonas] = useState<CustomerPersona[]>(initialPersonas);
  const [selectedProduct, setSelectedProduct] = useState<string>(
    productOptions[0]
  );

  const addPersona = () => {
    setPersonas((prevPersonas) => [
      ...prevPersonas,
      {
        name: "New Customer Persona",
        description:
          "Description: responsibilities and pain points/needs (unconsistent wording or missing something)",
        consumedServices: [{ service: "components" }],
      },
    ]);
  };

  const updatePersona = (
    index: number,
    field: keyof CustomerPersona,
    value: string
  ) => {
    setPersonas((prevPersonas) =>
      prevPersonas.map((persona, i) =>
        i === index ? { ...persona, [field]: value } : persona
      )
    );
  };

  const updateConsumedService = (
    personaIndex: number,
    serviceIndex: number,
    value: string
  ) => {
    setPersonas((prevPersonas) =>
      prevPersonas.map((persona, i) =>
        i === personaIndex
          ? {
              ...persona,
              consumedServices: persona.consumedServices.map((service, j) =>
                j === serviceIndex ? { ...service, service: value } : service
              ),
            }
          : persona
      )
    );
  };

  const handleInputChange = (
    index: number,
    field: keyof CustomerPersona,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target as HTMLInputElement; // Explicitly cast event.target
    updatePersona(index, field, value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer user personas</h1>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {productOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {personas.map((persona, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle>
              <Input
                value={persona.name}
                onChange={(e) => handleInputChange(index, "name", e)}
                className="text-xl font-bold"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={persona.description}
              onChange={(e) => handleInputChange(index, "description", e)}
              className="mb-4"
            />
            <ConsumedServices
              services={persona.consumedServices}
              personaIndex={index}
              updateConsumedService={updateConsumedService}
            />
          </CardContent>
        </Card>
      ))}

      <Button onClick={addPersona} className="mt-4">
        Add Persona
      </Button>
    </div>
  );
}
