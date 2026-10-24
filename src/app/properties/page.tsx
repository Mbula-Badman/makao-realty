```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PropertyBrowser } from "@/components/property-browser";
import { getProperties } from "@/lib/property-source";
import { getCustomerSession } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "Properties",
  description: "Explore land, homes, apartments and commercial property across Kenya.",
};

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const user = await getCustomerSession();

  if (!user) {
    redirect("/login?next=%2Fproperties");
  }

  const properties = await getProperties();

  return (
    <>
      <section className="bg-paper py-14 md:py-20">
        <div className="page-shell">
          <p className="eyebrow">The collection</p>
          <h1 className="section-title mt-4 max-w-2xl">
            Find a place that feels like yours.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-stone-500">
            Browse a considered selection of homes, land and spaces across Kenya.
          </p>
        </div>
      </section>

      <section className="page-shell py-10 md:py-14">
        <Suspense
          fallback={
            <p className="py-16 text-center text-sm text-stone-500">
              Preparing the collection…
            </p>
          }
        >
          <PropertyBrowser properties={properties} />
        </Suspense>
      </section>
    </>
  );
}
```