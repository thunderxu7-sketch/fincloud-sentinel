import type { Metadata } from "next";
import { ArchitecturePage } from "@/components/architecture-page";

export const metadata: Metadata = {
  title: "Architecture",
  description: "Production reference architecture for deterministic financial controls on Alibaba Cloud.",
};

export default function ArchitectureRoute() {
  return <ArchitecturePage />;
}
