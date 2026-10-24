import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Our story",
  description: "Learn about Makao Realty's thoughtful, people-first approach to property in Kenya.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-paper py-16 md:py-24">
        <div className="page-shell grid gap-10 md:grid-cols-[1fr_.85fr] md:items-end">
          <div><p className="eyebrow">A little about us</p><h1 className="section-title mt-4 max-w-2xl">A place is more than an address.</h1></div>
          <p className="max-w-lg text-sm leading-7 text-stone-600">It’s where life takes shape, where plans take root, and where new chapters begin. We believe finding the right one deserves time, care and a clear conversation.</p>
        </div>
      </section>
      <section className="page-shell grid gap-12 py-16 md:grid-cols-2 md:items-center md:gap-20 md:py-24">
        <div className="relative aspect-[1.05/1] overflow-hidden bg-sage"><Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1300&q=85" alt="Quiet, light-filled living space" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
        <div><p className="eyebrow">Our approach</p><h2 className="section-title mt-4">Good property decisions begin with people.</h2><p className="mt-5 text-sm leading-7 text-stone-600">Makao means home. It captures the feeling we want every client to have: supported, informed and at ease. We bring a considered perspective to property in Kenya, making room for honest questions and practical guidance.</p><p className="mt-4 text-sm leading-7 text-stone-600">We are building a property experience around transparency and trust. That means sharing what we know, being clear about what needs independent verification, and helping you take the next step at your own pace.</p><Link href="/properties" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-forest">Explore the collection <ArrowRight size={15} /></Link></div>
      </section>
      <section className="bg-forest py-16 text-white md:py-20"><div className="page-shell"><p className="eyebrow !text-gold">What guides us</p><h2 className="section-title mt-4 max-w-xl !text-white">The things we believe in.</h2><div className="mt-10 grid gap-8 md:grid-cols-3">{[
        { Icon: HeartHandshake, title: "Care, always", text: "We listen first, ask thoughtful questions and tailor our support to the person in front of us." },
        { Icon: ShieldCheck, title: "Honesty over hype", text: "We speak plainly about property information and never overstate what has been confirmed." },
        { Icon: Leaf, title: "A considered future", text: "We believe the right place can make room for new ideas, stronger communities and lasting roots." },
      ].map(({ Icon, title, text }) => <div key={title} className="border-t border-white/20 pt-6"><Icon size={21} className="text-gold" /><h3 className="mt-5 font-display text-2xl">{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{text}</p></div>)}</div></div></section>
      <section className="page-shell py-16 text-center md:py-20"><p className="eyebrow">Start somewhere</p><h2 className="section-title mx-auto mt-4 max-w-2xl">The first step can be a simple conversation.</h2><Link href="/contact" className="mt-7 inline-flex items-center gap-2 bg-forest px-6 py-3.5 text-xs font-semibold text-white hover:bg-ink">Get in touch <ArrowRight size={14} /></Link></section>
    </>
  );
}
