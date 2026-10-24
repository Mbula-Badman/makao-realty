import { MessageCircle } from "lucide-react";

export function WhatsAppLink({ message = "Hello Makao Realty, I would like to make an enquiry." }: { message?: string }) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-forest/20 px-5 py-3 text-[12px] font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white">
      <MessageCircle size={15} /> WhatsApp us
    </a>
  );
}
