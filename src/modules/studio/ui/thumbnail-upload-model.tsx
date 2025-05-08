import { ResponsiveModel } from "@/components/responsive-model";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModel {
    videoId: string;
    open : boolean;
    onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModel = ({videoId , open , onOpenChange}: ThumbnailUploadModel) => {
    const utils = trpc.useUtils();
    const onUploadComplete = async ()=>{
        onOpenChange(false);
        await utils.studio.getOne.invalidate({id: videoId});
        await utils.studio.getMany.invalidate();
    }
    return (
        <ResponsiveModel 
            open={open}
            onOpenChange={onOpenChange}
            title="Upload Thumbnail"
            >
            <UploadDropzone endpoint="thumbnailUploader" input={{videoId}} onClientUploadComplete={onUploadComplete} />

            </ResponsiveModel>

    );
};