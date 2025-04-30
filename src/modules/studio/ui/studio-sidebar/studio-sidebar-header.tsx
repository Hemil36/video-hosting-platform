"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"


export const StudioSidebarHeader = () => {
    const {user} = useUser();
    const {state} = useSidebar();
    if (!user) {
        return (
            <SidebarHeader className="flex-1 justify-center  items-center gap-2 flex-shrink-0">
                <Skeleton className="mx-auto size-[112px] hover:opacity-80 transition-opacity duration-200 ease-in-out" />
                <div className="flex mt-2 flex-col items-center justify-center gap-y-1">
                    <Skeleton className="w-[100px] h-[20px]" />
                    <Skeleton className="w-[80px] h-[15px]" />
                </div>
            </SidebarHeader>
        )

    }

    if(state=="collapsed"){
        return (
            <SidebarHeader className="flex-1 justify-center  items-center gap-2 flex-shrink-0">
                <Link href="/user/current" className="">
                <Avatar  className="mx-auto size-[30px] hover:opacity-80 transition-opacity duration-200 ease-in-out">
                    <AvatarImage  src={user.imageUrl} alt="User Avatar" />
                </Avatar>
                </Link>
            </SidebarHeader>
        )
    }

    return (
        <div className="flex-1 justify-center  items-center gap-2 flex-shrink-0">
            <Link href="/user/current" className="">
            <Avatar className="mx-auto size-[112px] hover:opacity-80 transition-opacity duration-200 ease-in-out">
                <AvatarImage src={user.imageUrl} alt="User Avatar" />
            </Avatar>
            </Link>
            <div className="flex mt-2 flex-col items-center justify-center gap-y-2">
                <p className="text-sm text-muted-foreground">Your Profile</p>
                <p className="text-xs font-semibold">{user?.fullName}</p>
            </div>
        </div>
    )
}