import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/auth-button";

export const HomeNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white  p-4 flex justify-between items-center">
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <SidebarTrigger />
                    <Link href="/">
                    <div className="flex items-center gap-2">   
                        <h1 className="text-xl font-bold tracking-tighter">NewTube</h1>
                        <Image src="./logo.svg" alt="Logo" width={40} height={40}  />
                    </div>
                    </Link>
                </div>

                <div className="flex flex-1 justify-center items-center gap-4 mx-auto max-w-[800px]">
                    <SearchInput />
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <AuthButton />
                </div>


                    
        </div>
        </nav>
    );
    }