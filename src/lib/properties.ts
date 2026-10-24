export type Property = {
  slug: string;
  title: string;
  location: string;
  county: string;
  price: number;
  category: "Land" | "House" | "Apartment" | "Commercial";
  status: "For sale" | "For rent";
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  images: string[];
  featured?: boolean;
  badge?: string;
  description: string;
  amenities: string[];
  reference: string;
};

const image = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const properties: Property[] = [
  {
    slug: "the-glasshouse-runda",
    title: "The Glasshouse, Runda",
    location: "Runda, Nairobi",
    county: "Nairobi",
    price: 48500000,
    category: "House",
    status: "For sale",
    size: "5,200 sq ft",
    bedrooms: 5,
    bathrooms: 4,
    image: image("photo-1600607687939-ce8a6c25118c"),
    images: [
      image("photo-1600607687939-ce8a6c25118c"),
      image("photo-1600210492486-724fe5c67fb0"),
      image("photo-1600607687920-4e2a09cf159d"),
    ],
    featured: true,
    badge: "Editor’s pick",
    reference: "MK-0248",
    description:
      "A calm, light-filled home framed by mature greenery. Generous living spaces open onto a private garden, with room for family life and relaxed entertaining.",
    amenities: ["Landscaped garden", "Staff quarters", "Solar water heating", "Gated community"],
  },
  {
    slug: "garden-apartment-kilimani",
    title: "Garden apartment, Kilimani",
    location: "Kilimani, Nairobi",
    county: "Nairobi",
    price: 18500000,
    category: "Apartment",
    status: "For sale",
    size: "1,850 sq ft",
    bedrooms: 3,
    bathrooms: 3,
    image: image("photo-1600566753086-00f18fb6b3ea"),
    images: [
      image("photo-1600566753086-00f18fb6b3ea"),
      image("photo-1600607687920-4e2a09cf159d"),
      image("photo-1600210492486-724fe5c67fb0"),
    ],
    featured: true,
    reference: "MK-0247",
    description:
      "A generous apartment with an easy indoor-outdoor rhythm, in a well-connected neighbourhood close to the everyday essentials.",
    amenities: ["Private terrace", "Swimming pool", "Lift access", "24-hour security"],
  },
  {
    slug: "ridgeway-acreage",
    title: "A quieter kind of space",
    location: "Ridgeways, Nairobi",
    county: "Nairobi",
    price: 12500000,
    category: "Land",
    status: "For sale",
    size: "¼ acre",
    image: image("photo-1500382017468-9049fed747ef"),
    images: [
      image("photo-1500382017468-9049fed747ef"),
      image("photo-1470252649378-9c29740c9fa8"),
    ],
    featured: true,
    badge: "New listing",
    reference: "MK-0246",
    description:
      "A leafy quarter-acre parcel in a sought-after residential setting. The setting offers room to imagine a considered home of your own.",
    amenities: ["Residential neighbourhood", "Road access", "Utilities nearby"],
  },
  {
    slug: "coastline-villa-diani",
    title: "Coastline villa, Diani",
    location: "Diani Beach, Kwale",
    county: "Kwale",
    price: 36000000,
    category: "House",
    status: "For sale",
    size: "3,100 sq ft",
    bedrooms: 4,
    bathrooms: 4,
    image: image("photo-1613490493576-7fde63acd811"),
    images: [
      image("photo-1613490493576-7fde63acd811"),
      image("photo-1600607687939-ce8a6c25118c"),
      image("photo-1600566753086-00f18fb6b3ea"),
    ],
    featured: true,
    reference: "MK-0245",
    description:
      "A relaxed coastal retreat with open-air living and private outdoor space. A thoughtful base for slow mornings and warm evenings.",
    amenities: ["Private pool", "Garden", "Outdoor dining", "Guest suite"],
  },
  {
    slug: "limuru-road-land",
    title: "Room to grow, Limuru Road",
    location: "Kiambu Road, Kiambu",
    county: "Kiambu",
    price: 8200000,
    category: "Land",
    status: "For sale",
    size: "½ acre",
    image: image("photo-1470252649378-9c29740c9fa8"),
    images: [image("photo-1470252649378-9c29740c9fa8"), image("photo-1500382017468-9049fed747ef")],
    reference: "MK-0244",
    description:
      "A half-acre plot offering a little more breathing room within easy reach of Nairobi. Please enquire for current site and title information.",
    amenities: ["Accessible location", "Residential setting", "Utilities nearby"],
  },
  {
    slug: "westlands-workspace",
    title: "A brighter workspace",
    location: "Westlands, Nairobi",
    county: "Nairobi",
    price: 320000,
    category: "Commercial",
    status: "For rent",
    size: "2,400 sq ft",
    image: image("photo-1497366754035-f200968a6e72"),
    images: [image("photo-1497366754035-f200968a6e72"), image("photo-1497366216548-37526070297c")],
    reference: "MK-0243",
    description:
      "A bright, flexible commercial space in the heart of Westlands. Well suited to a growing team looking for a welcoming address.",
    amenities: ["Secure parking", "Lift access", "Backup generator", "Reception"],
  },
];

export const formatPrice = (price: number, status: Property["status"]) =>
  `KSh ${new Intl.NumberFormat("en-KE").format(price)}${status === "For rent" ? " / month" : ""}`;

export const propertyCategories = ["All properties", "Land", "House", "Apartment", "Commercial"] as const;
