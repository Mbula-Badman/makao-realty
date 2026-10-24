"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

export function Brand() {
  return (
    <Link href="/" aria-label="Makao Realty home" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full border border-gold text-[17px] font-semibold tracking-[-.1em] text-forest">
        m.
      </span>
      <span className="leading-none">
        <span className="block font-display text-[19px] tracking-[-.04em] text-ink">makao</span>
        <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[.29em] text-stone-500">realty</span>
      </span>
    </Link>
  );
}

const links = [
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const dark = useSyncExternalStore(
    (notify) => {
      window.addEventListener("makao-theme-change", notify);
      window.addEventListener("storage", notify);
      return () => {
        window.removeEventListener("makao-theme-change", notify);
        window.removeEventListener("storage", notify);
      };
    },
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );

  function toggleTheme() {
    const nextTheme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("makao-theme", nextTheme);
    window.dispatchEvent(new Event("makao-theme-change"));
  }

  return (
    <header className="relative z-30 border-b border-stone-200/70 bg-white">
      <div className="page-shell flex h-[76px] items-center justify-between">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[13px] text-stone-600 transition hover:text-forest">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/login" className="hidden text-[12px] font-semibold text-forest transition hover:text-gold md:inline">
          Sign in
        </Link>
        <Link href="/contact" className="hidden items-center gap-2 rounded-sm bg-forest px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-ink md:flex">
          Let’s talk <span aria-hidden="true">↗</span>
        </Link>
        <Link href="/register" className="hidden items-center gap-2 border border-forest/20 px-4 py-3 text-[12px] font-semibold text-forest transition hover:border-forest md:flex">
          Create account
        </Link>
        <button
          type="button"
          aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
          aria-pressed={dark}
          onClick={toggleTheme}
          className="ml-auto grid h-10 w-10 place-items-center text-ink transition hover:text-gold md:ml-0"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center text-ink md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile navigation" className="absolute inset-x-0 top-full border-t border-stone-100 bg-white px-6 py-5 shadow-soft md:hidden">
          {links.map((link) => (
            <Link onClick={() => setOpen(false)} key={link.href} href={link.href} className="block py-3 text-sm text-ink">
              {link.label}
            </Link>
          ))}
          <Link onClick={() => setOpen(false)} href="/login" className="block py-3 text-sm text-ink">Sign in</Link>
          <Link onClick={() => setOpen(false)} href="/register" className="block py-3 text-sm font-semibold text-forest">Create account</Link>
        </nav>
      )}
    </header>
  );
}
