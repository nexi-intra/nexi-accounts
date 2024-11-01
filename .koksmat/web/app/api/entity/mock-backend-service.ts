import { z } from "zod";
import {
  Account,
  Country,
  Purpose,
  Tag,
  User,
  schemaMapObjects,
  SchemaName,
} from "./schemas";

import { SharedAttributes } from "./schemas/_shared";
// Define a union type for all entity types
type EntityType = Account | Country | Purpose | Tag | User;

/**
 * MockBackendService
 *
 * This file contains a mock implementation of the backend service
 * for the Magic Links project. It simulates database operations
 * using in-memory storage with pre-populated data.
 */

type EntityInput<T extends z.ZodObject<any>> = z.input<
  typeof SharedAttributes
> &
  z.input<T>;
type EntityOutput<T extends z.ZodObject<any>> = z.output<
  typeof SharedAttributes
> &
  z.output<T>;
let id = 0;
export function createEntity<T extends z.ZodObject<any>>(
  schema: T,
  userId: string,
  data: Partial<EntityInput<T>>
): EntityOutput<T> {
  const now = new Date();
  id++;
  const sharedData = {
    id: id,
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId,
    deletedAt: null,
    deletedBy: null,
  };

  const mergedData = {
    ...sharedData,
    ...data,
  };

  const validatedData = SharedAttributes.merge(schema).parse(mergedData);
  return validatedData as unknown as EntityOutput<T>;
}
//TODO: Move the examples into the schema files
// Pre-populated mock database
const db: Record<string, any[]> = {
  account: [],
  country: [
    // European countries
    createEntity(schemaMapObjects.country, "system", {
      name: "Albania",
      code: "AL",
      continent: "Europe",
      currency: "ALL",
      phoneCode: "+355",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Austria",
      code: "AT",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+43",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Belgium",
      code: "BE",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+32",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Croatia",
      code: "HR",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+385",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Denmark",
      code: "DK",
      continent: "Europe",
      currency: "DKK",
      phoneCode: "+45",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Estonia",
      code: "EE",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+372",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Finland",
      code: "FI",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+358",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "France",
      code: "FR",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+33",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Germany",
      code: "DE",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+49",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Greece",
      code: "GR",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+30",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Hungary",
      code: "HU",
      continent: "Europe",
      currency: "HUF",
      phoneCode: "+36",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Iceland",
      code: "IS",
      continent: "Europe",
      currency: "ISK",
      phoneCode: "+354",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Italy",
      code: "IT",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+39",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Latvia",
      code: "LV",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+371",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Netherlands",
      code: "NL",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+31",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Norway",
      code: "NO",
      continent: "Europe",
      currency: "NOK",
      phoneCode: "+47",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Poland",
      code: "PL",
      continent: "Europe",
      currency: "PLN",
      phoneCode: "+48",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Portugal",
      code: "PT",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+351",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Spain",
      code: "ES",
      continent: "Europe",
      currency: "EUR",
      phoneCode: "+34",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "Sweden",
      code: "SE",
      continent: "Europe",
      currency: "SEK",
      phoneCode: "+46",
    }),
    createEntity(schemaMapObjects.country, "system", {
      name: "United Kingdom",
      code: "GB",
      continent: "Europe",
      currency: "GBP",
      phoneCode: "+44",
    }),
  ],
  purpose: [
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Collaboration",
      description: "Tools for team collaboration and communication",
      category: "Productivity",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Project Management",
      description: "Tools for planning, executing, and tracking projects",
      category: "Productivity",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Customer Relationship Management",
      description: "Tools for managing company interactions with customers",
      category: "Sales",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Marketing Automation",
      description: "Tools for automating marketing activities and campaigns",
      category: "Marketing",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Data Analysis",
      description: "Tools for analyzing and interpreting data",
      category: "Analytics",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Content Creation",
      description: "Tools for creating and editing content",
      category: "Creative",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Email Management",
      description: "Tools for managing email communications",
      category: "Communication",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "File Storage",
      description: "Tools for storing and sharing files",
      category: "Storage",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Video Conferencing",
      description: "Tools for conducting video meetings",
      category: "Communication",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Networking",
      description: "Tools for managing network infrastructure",
      category: "IT",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Security",
      description: "Tools for securing systems and data",
      category: "IT",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Development",
      description: "Tools for software development and version control",
      category: "Engineering",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Accounting",
      description: "Tools for managing financial transactions",
      category: "Finance",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Human Resources",
      description: "Tools for managing employee information and recruitment",
      category: "HR",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Customer Support",
      description: "Tools for providing customer service and support",
      category: "Support",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Scheduling",
      description: "Tools for scheduling meetings and appointments",
      category: "Productivity",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Learning Management",
      description: "Tools for managing training and educational content",
      category: "Education",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "E-commerce",
      description: "Tools for managing online sales and storefronts",
      category: "Sales",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Design",
      description: "Tools for graphic and UI/UX design",
      category: "Creative",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Cloud Computing",
      description: "Tools for cloud infrastructure and services",
      category: "IT",
    }),
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Social Media Management",
      description: "Tools for managing social media accounts and content",
      category: "Marketing",
    }),
  ],
  tag: [
    createEntity(schemaMapObjects.tag, "system", {
      name: "Microsoft 365",
      color: "#0078D4",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Google Workspace",
      color: "#4285F4",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Adobe Creative Cloud",
      color: "#FF0000",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Slack",
      color: "#4A154B",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Atlassian",
      color: "#0052CC",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Salesforce",
      color: "#1798C1",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Zoom",
      color: "#2D8CFF",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Dropbox",
      color: "#0061FF",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Amazon Web Services",
      color: "#FF9900",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "GitHub",
      color: "#181717",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Jira",
      color: "#2684FF",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Trello",
      color: "#0079BF",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Notion",
      color: "#000000",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Asana",
      color: "#273347",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "SAP",
      color: "#0FAAFF",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Oracle",
      color: "#F80000",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "IBM Cloud",
      color: "#054ADA",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Apple",
      color: "#A2AAAD",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Cisco",
      color: "#1BA0D7",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "HubSpot",
      color: "#FF7A59",
    }),
    createEntity(schemaMapObjects.tag, "system", {
      name: "Zendesk",
      color: "#03363D",
    }),
  ],

  user: [
    createEntity(schemaMapObjects.user, "system", {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      countryId: "GB",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      countryId: "US",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "user",
      countryId: "CA",
      status: "inactive",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Bob Williams",
      email: "bob.williams@example.com",
      role: "editor",
      countryId: "AU",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Carol Martinez",
      email: "carol.martinez@example.com",
      role: "user",
      countryId: "ES",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "David Brown",
      email: "david.brown@example.com",
      role: "admin",
      countryId: "DE",
      status: "inactive",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Eva Davis",
      email: "eva.davis@example.com",
      role: "user",
      countryId: "FR",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Frank Miller",
      email: "frank.miller@example.com",
      role: "editor",
      countryId: "IT",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Grace Wilson",
      email: "grace.wilson@example.com",
      role: "user",
      countryId: "NL",
      status: "inactive",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Henry Taylor",
      email: "henry.taylor@example.com",
      role: "admin",
      countryId: "SE",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Ivy Anderson",
      email: "ivy.anderson@example.com",
      role: "user",
      countryId: "NO",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Jack Thomas",
      email: "jack.thomas@example.com",
      role: "editor",
      countryId: "FI",
      status: "inactive",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Kathy Jackson",
      email: "kathy.jackson@example.com",
      role: "user",
      countryId: "DK",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Leo White",
      email: "leo.white@example.com",
      role: "user",
      countryId: "IE",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Mia Harris",
      email: "mia.harris@example.com",
      role: "admin",
      countryId: "NZ",
      status: "inactive",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Nick Martin",
      email: "nick.martin@example.com",
      role: "user",
      countryId: "CH",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Olivia Lee",
      email: "olivia.lee@example.com",
      role: "editor",
      countryId: "BE",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Paul Walker",
      email: "paul.walker@example.com",
      role: "user",
      countryId: "AT",
      status: "inactive",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Queen Young",
      email: "queen.young@example.com",
      role: "user",
      countryId: "PT",
      status: "active",
    }),
    createEntity(schemaMapObjects.user, "system", {
      name: "Ryan King",
      email: "ryan.king@example.com",
      role: "admin",
      countryId: "GR",
      status: "active",
    }),
  ],
};

// Mock backend service
const mockBackendService = {
  getAll: async (entityType: string, page: number, pageSize: number) => {
    const entities = db[entityType] || [];
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = entities.slice(startIndex, endIndex);
    const totalCount = entities.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  getById: async (entityType: string, id: string) => {
    const entity = (db[entityType] || []).find((item) => item.id === id);
    if (!entity) {
      throw new Error("Entity not found");
    }
    return entity;
  },

  create: async (entityType: string, data: Partial<EntityType>) => {
    const schema = schemaMapObjects[entityType as SchemaName];
    if (!schema) {
      throw new Error("Invalid entity type");
    }
    const newEntity = createEntity(schema, "system", data);
    db[entityType].push(newEntity);
    return newEntity;
  },

  update: async (entityType: string, id: string, data: Partial<EntityType>) => {
    const index = db[entityType].findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Entity not found");
    }
    const schema = schemaMapObjects[entityType as SchemaName];
    if (!schema) {
      throw new Error("Invalid entity type");
    }
    const updatedEntity = createEntity(schema, "system", {
      ...db[entityType][index],
      ...data,
      updatedAt: new Date(),
    });
    db[entityType][index] = updatedEntity;
    return updatedEntity;
  },

  delete: async (entityType: string, id: string) => {
    const index = db[entityType].findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Entity not found");
    }
    db[entityType].splice(index, 1);
  },
};

// Factory function to create the mock backend service
export const mockBackendServiceFactory = () => mockBackendService;
