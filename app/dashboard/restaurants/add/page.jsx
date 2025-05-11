import { requireAuth } from "@/lib/auth-helpers";
import AddClient from './AddClient';

export default async function RestaurantsListPage() {
  const session = await requireAuth(); 

  return <AddClient session={session} />;
}
