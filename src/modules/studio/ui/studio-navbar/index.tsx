import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/modules/auth/ui/auth-button";
import { StudioUploadModel } from "./studio-upload-model";

export const StudioNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-md  p-4 flex justify-between items-center">
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <SidebarTrigger />
                    
                    <Link href="/">
                    <div className="flex items-center gap-2">   
                        <Image src="./logo.svg" alt="Logo" width={40} height={40}  />
                        <h1 className="text-2xl font-bold tracking-tighter">Studio</h1>
                    </div>
                    </Link>
                </div>

                <div className="flex flex-1 justify-center items-center gap-4 mx-auto max-w-[800px]">
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                <StudioUploadModel />
                    <AuthButton />
                </div>


                    
        </div>
        </nav>
    );
    }