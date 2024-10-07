"use client";
import CustomerAccountLayout from "@/components/customer-account-layout";
import React from "react";

export default function Layout(props: { children: React.ReactNode }) {
  return <CustomerAccountLayout {...props} />;
}
