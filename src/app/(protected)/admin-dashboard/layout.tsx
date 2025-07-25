import type { PropsWithChildren } from "react";

import { getCurrentUser } from "@/server/actions/auth";
import { AdminLayoutContent } from "./_components/admin-layout-content";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const user = await getCurrentUser();
  console.log("[user]", user);
  // TODO: remove this after testing
  // if (!user || user.role.toLowerCase() !== "admin") {
  //   return notFound();
  // }

  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
