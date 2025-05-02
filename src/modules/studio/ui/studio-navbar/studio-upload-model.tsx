"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { VideoUploader } from "../studio-video-uploader";
import { ResponsiveModel } from "@/components/responsive-model";
import { useState } from "react";

export const StudioUploadModel = () => {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onError: (error) => {
      toast.error("Error creating video: " + error.message);
    },
    onSuccess: () => {
      toast.success("Video created successfully!");
      utils.studio.getMany.invalidate();
     
    },
  });


  const onSuccess = () => {
    if(!create.data?.video.id) return; 
    create.reset();

    router.push(`/studio/videos/${create.data?.video.id}`);

  }

  return (
    <>
      <ResponsiveModel
        open={!!create.data?.url}
        title="Upload Video"
        onOpenChange={()=> create.reset()}
      >
        {create.data?.url ? <VideoUploader endpoint={create.data.url} onSuccess={onSuccess}
        /> : <Loader2Icon />}
       
      </ResponsiveModel>
      <Button
        variant="secondary"
        onClick={() => {
          create.mutate();
        }}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className=" animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};
