import { requireAuth } from "@/lib/auth-helpers";
import { PrismaClient } from "@prisma/client";
import OrdersClient from "./OrdersClient";

const prisma = new PrismaClient();

export default async function OrdersPage() {
  const session = await requireAuth(); 

  

  const orders = await prisma.order.findMany();

  return <OrdersClient orders={orders} />;
}
