"use client";

import { useRouter } from "next/navigation";
import { APPNAME } from "../global";
import Link from "next/link";
import { SimpleAccountSearchComponent } from "@/components/simple-account-search";

export default function Page() {
  const router = useRouter();
  return (
    <div className="space-x-2 h-[90vh] place-content-center ">
      <SimpleAccountSearchComponent />
    </div>
  );
}
