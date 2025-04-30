"use client"

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import {  PlusIcon } from "lucide-react";

export const StudioUploadModel = () => {
    const create = trpc.videos.create.useMutation({
        onError: (error) => {
            console.error("Mutation error:", error);
            alert(error.message);
        },
        onSuccess: (data) => {
            console.log("Mutation success:", data);
        }
    });
    
    return(
       <Button  variant="secondary" onClick={()=>{console.log("clicked");create.mutate()}}>
        <PlusIcon />
        Uploa
       </Button>
    )
}