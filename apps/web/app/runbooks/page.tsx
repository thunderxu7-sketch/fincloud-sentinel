import type { Metadata } from "next";
import { RunbooksPage } from "@/components/runbooks-page";

export const metadata: Metadata = {
  title: "Runbooks",
  description: "Versioned procedures for financial incidents, reconciliation, recovery, rollback, and AI degradation.",
};

export default function RunbooksRoute() {
  return <RunbooksPage />;
}
