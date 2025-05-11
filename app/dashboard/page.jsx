import { requireAuth } from "@/lib/auth-helpers";
import { PrismaClient } from "@prisma/client";
import DashboardClient from "./DashboardClient";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await requireAuth(); 

  

  const orders = await prisma.order.findMany();

  return <DashboardClient orders={orders} />;
}
