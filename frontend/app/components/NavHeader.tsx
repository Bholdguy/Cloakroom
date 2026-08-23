"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Compliance", href: "#compliance" },
  { label: "FAQ", href: "#faq" },
];

export default function NavHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3">
      {/* Pill container */}
      <nav
        className="w-full max-w-5xl flex items-center justify-between px-3 py-2 rounded-full bg-white"
        style={{ border: "3px solid #000", boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
      >
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="flex-shrink-0 overflow-hidden rounded-full"
            style={{ width: 36, height: 36, border: "2px solid #000" }}
          >
            <Image
              src="/logo.png"
              alt="Cloakroom logo"
              width={36}
              height={36}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <span
            className="font-bold text-sm tracking-tight text-black hidden sm:inline"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            CLOAKROOM
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="px-3 py-1.5 rounded-full text-sm font-semibold text-black/55 hover:text-black hover:bg-black/5 transition-colors"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA button */}
        <div className="hidden md:flex">
          <a
            href="/portal"
            className="btn-violet px-5 py-2 rounded-full"
            style={{ fontSize: "0.8rem" }}
          >
            Launch Portal →
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-1.5 text-black rounded-full hover:bg-black/5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? (
              <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></>
            ) : (
              <><line x1="2" y1="6" x2="18" y2="6" /><line x1="2" y1="10" x2="18" y2="10" /><line x1="2" y1="14" x2="18" y2="14" /></>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="absolute top-[60px] left-4 right-4 max-w-5xl mx-auto rounded-2xl bg-white px-5 py-4 flex flex-col gap-2"
          style={{ border: "3px solid #000", boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="py-2 text-sm font-semibold text-black/70 hover:text-black border-b border-black/10 last:border-b-0"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/portal"
            className="btn-violet mt-2 py-2.5 rounded-xl text-center text-sm"
            onClick={() => setOpen(false)}
          >
            Launch Portal →
          </a>
        </div>
      )}
    </div>
  );
}
