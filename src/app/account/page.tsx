import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/account-dashboard";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Your account",
  description: "Review your Makao Realty property enquiries.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCustomerSession();
  if (!user) redirect("/login");
  const enquiries = await prisma.enquiry.findMany({
    where: { userId: user.id },
    include: { property: { select: { title: true, slug: true, reference: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return <AccountDashboard name={user.name} email={user.email} enquiries={enquiries} />;
}
