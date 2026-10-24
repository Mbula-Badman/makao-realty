import Link from "next/link";
import { Brand } from "@/components/header";

export function Footer() {
  const email = process.env.NEXT_PUBLIC_EMAIL || "hello@makao.example";
  return (
    <footer className="bg-forest text-white">
      <div className="page-shell grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:py-20">
        <div>
          <div className="[&_span]:text-white"><Brand /></div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
            Thoughtful guidance for finding a place to call your own. Land, homes and considered investments across Kenya.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-gold">Explore</p>
          <div className="mt-5 grid gap-3 text-sm text-white/70">
            <Link href="/properties">All properties</Link>
            <Link href="/about">Our story</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow !text-gold">Say hello</p>
          <a className="mt-5 inline-block text-sm text-white/75 hover:text-white" href={`mailto:${email}`}>{email}</a>
          <p className="mt-3 text-sm text-white/55">{process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "Nairobi, Kenya"}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-2 py-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Makao Realty. All rights reserved.</span>
          <span>Property information should be independently verified.</span>
        </div>
      </div>
    </footer>
  );
}
