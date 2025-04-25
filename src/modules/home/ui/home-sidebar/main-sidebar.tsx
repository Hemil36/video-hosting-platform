import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
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
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {item.map((item) => {
                        return (
                            <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={false}  tooltip={item.title}>
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