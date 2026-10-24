import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Makao Realty about property in Kenya.",
};

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_EMAIL || "hello@makao.example";
  const phone = process.env.NEXT_PUBLIC_PHONE || "Contact number to be confirmed";
  const address = process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "Nairobi, Kenya";
  return (
    <section className="bg-paper py-14 md:py-20">
      <div className="page-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div><p className="eyebrow">We’re listening</p><h1 className="section-title mt-4">Tell us what you’re looking for.</h1><p className="mt-5 max-w-md text-sm leading-7 text-stone-600">A question, a viewing, or just a first step. Leave us a note and we’ll help you find your way.</p>
          <div className="mt-9 space-y-5">
            <div className="flex gap-4"><Mail size={17} className="mt-0.5 text-gold" /><div><p className="text-[10px] uppercase tracking-[.13em] text-stone-400">Email</p><a href={`mailto:${email}`} className="mt-1 block text-sm text-ink">{email}</a></div></div>
            <div className="flex gap-4"><Phone size={17} className="mt-0.5 text-gold" /><div><p className="text-[10px] uppercase tracking-[.13em] text-stone-400">Phone</p><a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="mt-1 block text-sm text-ink">{phone}</a></div></div>
            <div className="flex gap-4"><MapPin size={17} className="mt-0.5 text-gold" /><div><p className="text-[10px] uppercase tracking-[.13em] text-stone-400">Find us</p><p className="mt-1 text-sm text-ink">{address}</p></div></div>
            <div className="flex gap-4"><Clock3 size={17} className="mt-0.5 text-gold" /><div><p className="text-[10px] uppercase tracking-[.13em] text-stone-400">Business hours</p><p className="mt-1 text-sm text-ink">Hours to be confirmed</p></div></div>
          </div>
          <div className="mt-8"><WhatsAppLink /></div>
        </div>
        <div className="bg-white p-6 shadow-soft sm:p-9"><h2 className="font-display text-2xl text-ink">Send us a message</h2><p className="mt-2 mb-6 text-xs text-stone-500">We’ll get back to you as soon as we can.</p><EnquiryForm /></div>
      </div>
    </section>
  );
}
