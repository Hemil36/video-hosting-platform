"use client"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuth, useClerk } from "@clerk/nextjs"
import {  HistoryIcon,  ListVideoIcon,  ThumbsUpIcon } from "lucide-react"
import Link from "next/link"



const item = [
    {
        title: "History",
        icon : HistoryIcon,
        url : "/playlist/history",
        auth : true

    }
    ,{
        title:"Liked Videos",
        icon : ThumbsUpIcon,
        url:"/playlist/like",
        auth : true
    },{
        title :"All Playlists" ,
        icon : ListVideoIcon,
        url : "/playlist",
        auth : true
    }
]






export const PersonalSection = () => {
    const {isSignedIn} = useAuth();
    const clerk = useClerk();
    return (
        <SidebarGroup>
                      <SidebarGroupLabel>You</SidebarGroupLabel>

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