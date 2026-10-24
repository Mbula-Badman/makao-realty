import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Makao Realty account to keep your property enquiries together.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
