"use client";

import FilterCarousel from "@/components/filter-carousal";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface CategorySectionProps {
  categoryId?: string;
}

export const CategorySection = ({ categoryId }: CategorySectionProps) => {
  return (
    <Suspense fallback={<CategorySectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading categories</div>}>
        <CategorySectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySectionSkeleton = () => {
  return (
    <FilterCarousel
      onSelect={() => {}}
      isLoading={true}
      value={undefined}
      data={[]}
    />
  );
};

const onSelect = (value: string | null) => {
   const url = new URL(window.location.href);
   if (value) {
     url.searchParams.set("categoryId", value);
   }
    else {
      url.searchParams.delete("categoryId");
    }
    window.history.pushState({}, "", url);
    // window.location.reload();
  }

export const CategorySectionSuspense = ({
  categoryId,
}: CategorySectionProps) => {
  const [categoryData] = trpc.categories.getMany.useSuspenseQuery();

  const data = categoryData.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <FilterCarousel
      onSelect={onSelect}
      value={categoryId}
      data={data}
    />
  );
};
