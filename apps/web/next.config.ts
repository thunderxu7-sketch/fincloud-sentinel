import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Keep regular CI and local exports mounted at `/`; only the dedicated Pages
// workflow needs the repository sub-path. Using GITHUB_ACTIONS here made every
// GitHub runner emit Pages-prefixed assets, which broke local static E2E serving.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repository = "fincloud-sentinel";
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? `/${repository}` : "",
  assetPrefix: isGitHubPages ? `/${repository}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@fincloud/domain"],
  turbopack: { root: workspaceRoot },
};

export default nextConfig;
