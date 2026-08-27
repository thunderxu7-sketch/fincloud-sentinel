import type { Metadata } from "next";
import { ControlPlanePage } from "@/components/control-plane-page";

export const metadata: Metadata = {
  title: "Control plane",
  description: "Operate transaction risk, settlement, reconciliation, and evidence-grounded incident containment.",
};

export default function ConsolePage() {
  return <ControlPlanePage />;
}
