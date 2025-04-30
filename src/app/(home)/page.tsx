import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/views/homeView";
export const dynamic = "force-dynamic"; // Forces this page to always be SSR

interface PageProps {
  searchParams: Promise<{
    categoryId: string;
  }>;
}
const page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();

  return (
    <>
      <HydrateClient>
        <HomeView categoryId={categoryId} />
      </HydrateClient>
    </>
  );
};

export default page;
