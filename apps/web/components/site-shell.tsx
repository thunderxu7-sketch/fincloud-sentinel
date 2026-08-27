"use client";

import { Code2, Fingerprint, Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LocaleProvider, useLocale } from "./locale-provider";

const navigation = {
  en: [
    ["Home", "/"],
    ["Control plane", "/console"],
    ["Architecture", "/architecture"],
    ["Runbooks", "/runbooks"],
  ],
  "zh-CN": [
    ["首页", "/"],
    ["控制平台", "/console"],
    ["解决方案架构", "/architecture"],
    ["运行手册", "/runbooks"],
  ],
} as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.endsWith("/fincloud-sentinel");
  return pathname === href || pathname.endsWith(href) || pathname.includes(`${href}/`);
}

function SiteHeader() {
  const pathname = usePathname();
  const { locale, toggleLocale } = useLocale();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="FinCloud Sentinel home">
        <span className="brand-mark"><Fingerprint size={20} /></span>
        <span>FinCloud <strong>Sentinel</strong></span>
      </Link>
      <nav aria-label="Primary navigation">
        {navigation[locale].map(([label, href]) => (
          <Link className={isActiveRoute(pathname, href) ? "active" : ""} href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <button className="language-button" type="button" onClick={toggleLocale} aria-label="Switch language">
          <Languages size={16} /> {locale === "en" ? "中文" : "EN"}
        </button>
        <a className="github-button" href="https://github.com/thunderxu7-sketch/fincloud-sentinel" target="_blank" rel="noreferrer">
          <Code2 size={17} /> GitHub
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  const { locale } = useLocale();
  const note = locale === "en"
    ? "Interview-ready reference architecture—not a production financial service."
    : "面向技术面试与生产决策的参考架构，不是实际金融生产系统。";

  return (
    <footer>
      <div className="brand"><span className="brand-mark"><Fingerprint size={18} /></span><span>FinCloud <strong>Sentinel</strong></span></div>
      <p>{note}</p>
      <a href="https://github.com/thunderxu7-sketch/fincloud-sentinel" target="_blank" rel="noreferrer"><Code2 size={16} /> Apache-2.0</a>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <SiteHeader />
      {children}
      <SiteFooter />
    </LocaleProvider>
  );
}
