import { requireAuth } from "@/lib/auth-helpers";
import RestaurantsListClient from './RestaurantsListClient';

export default async function RestaurantsListPage() {
  const session = await requireAuth(); 

  return <RestaurantsListClient session={session} />;
}
