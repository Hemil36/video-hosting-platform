"use client"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuth, useClerk } from "@clerk/nextjs"
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react"
import Link from "next/link"



const item = [
    {
        title: "Home",
        icon : HomeIcon,
        url : "/",
    }
    ,{
        title:"Subscriptions",
        icon : PlaySquareIcon,
        url:"/feed/subscriptions",
        auth : true
    },{
        title :"Trending" ,
        icon : FlameIcon,
        url : "/feed/trending",
    }
]






export const MainSection = () => {
    const {isSignedIn} = useAuth();
    const clerk = useClerk();
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {item.map((item) => {
                        return (
                            <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={false}  tooltip={item.title}
                  onClick={(e)=>{
                      if(!isSignedIn && item.auth){
                        e.preventDefault();
                        return clerk.openSignIn();
                    }
                  }}>
                    <Link href={item.url} className="flex items-center gap-4">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                        )
                    }
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}