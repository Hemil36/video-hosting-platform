import { HomeLayout } from "@/modules/home/ui/home-layout";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface LayoutProps {
    children: React.ReactNode;
}

const layout = ({children} : LayoutProps) => {
  return (
    <div>
      <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
<ErrorBoundary fallback={<div>Something went wrong</div>}>
        <HomeLayout>
        {children}
        </HomeLayout>
        </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  )
}

export default layout