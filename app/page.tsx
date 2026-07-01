import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import Dashboard from "@/components/dashboard";

export const metadata = {
  title: "Dashboard",
};

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <Dashboard />;
}