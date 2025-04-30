import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

import Link from "next/link"
import {  LogOutIcon, Video } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { StudioSidebarHeader } from "./studio-sidebar-header"

export const StudioSidebar = () => {
    return (
        <Sidebar className="pt-16 z-40 " collapsible="icon">
            <SidebarContent className="bg-background">
               <SidebarGroup>
                <SidebarMenu>
                    <StudioSidebarHeader />
                <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={false} tooltip="videos">
                            <Link href="/studio/content" className="flex items-center gap-4">

                                <Video className="size-5" />
                                <span>Content</span>
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                    <Separator />
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={false} tooltip="Exit ">
                            <Link href="/" className="flex items-center gap-4">

                                <LogOutIcon className="size-5" />
                                <span>Exit Studio</span>
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
               </SidebarGroup>
            </SidebarContent>
           
        </Sidebar>

    )
    }