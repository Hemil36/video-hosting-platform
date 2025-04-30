import { SidebarProvider } from "@/components/ui/sidebar";
import { StudioNavbar } from "./studio-navbar";
import { StudioSidebar } from "./studio-sidebar";


interface LayoutProps {
    children: React.ReactNode;
}

export const StudioLayout = ({children} : LayoutProps) => {
  return (
        <SidebarProvider>

        <div className="p-4  w-full">
            <StudioNavbar />
            <div className=" flex min-h-screen  pt-[4rem]">
                <StudioSidebar />
                <main className=" flex-1 overflow-y-auto
                ">

                {children}
                </main>
            </div>
        </div>
        </SidebarProvider>
  )
}

