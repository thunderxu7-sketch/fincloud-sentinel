import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
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
