import { z } from "zod";

import { CountrySchema } from "./country";
import { PurposeSchema } from "./purpose";
import { UserSchema } from "./user";

import { TagSchema } from "./tag";
import { AccountSchema } from "./account";

// Define SharedAttributes

// Generic function to create a schema for creating an entity
export function createInputSchema<T extends z.ZodObject<any>>(schema: T) {
  return schema.omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    deletedAt: true,
    deletedBy: true,
  });
}

// Generic function to create a schema for updating an entity
export function updateInputSchema<T extends z.ZodObject<any>>(schema: T) {
  return schema.partial().omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    deletedAt: true,
    deletedBy: true,
  });
}

// Generic function to create a response schema for a single entity
export function responseSchema<T extends z.ZodObject<any>>(schema: T) {
  return z.object({
    data: schema,
    message: z.string(),
    success: z.boolean(),
  });
}

// Generic function to create a response schema for a list of entities
export function listResponseSchema<T extends z.ZodObject<any>>(schema: T) {
  return z.object({
    data: z.object({
      items: z.array(schema),
      totalCount: z.number(),
      page: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
    }),
    message: z.string(),
    success: z.boolean(),
  });
}

export function defineEntitySchemas<T extends z.ZodObject<any>>(schema: T) {
  return {
    input: createInputSchema(schema),
    update: updateInputSchema(schema),
    response: responseSchema(schema),
    listResponse: listResponseSchema(schema),
  };
}

export type SchemaName = "account" | "country" | "purpose" | "user" | "tag";

export type SchemaMap = {
  account: Account;
  country: Country;
  purpose: Purpose;
  tag: Tag;

  user: User;
};
export const typeNames: { [K in SchemaName]: string } = {
  account: "Account",
  country: "Country",
  purpose: "Purpose",
  tag: "Tag",

  user: "User",
};
export const schemaMapTypes: { [K in SchemaName]: z.ZodType<SchemaMap[K]> } = {
  account: AccountSchema,
  country: CountrySchema,
  purpose: PurposeSchema,
  tag: TagSchema,

  user: UserSchema,
};
export const schemaMapObjects: {
  [K in SchemaName]: z.ZodObject<any, any, any>;
} = {
  account: AccountSchema,
  country: CountrySchema,
  purpose: PurposeSchema,
  tag: TagSchema,

  user: UserSchema,
};
export type Account = z.infer<typeof AccountSchema>;
export type Country = z.infer<typeof CountrySchema>;
export type Purpose = z.infer<typeof PurposeSchema>;
export type User = z.infer<typeof UserSchema>;

export type Tag = z.infer<typeof TagSchema>;

// Tool types
