import { Button } from "@/components/ui/button";
import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect, MuxUploaderProgress, MuxUploaderStatus } from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";
interface VideoUploaderProps {
    endpoint?: string | null;
    onSuccess: () => void;
}

export const VideoUploader = ({ endpoint, onSuccess }: VideoUploaderProps) => {
    return (
        <div className="video-uploader">
            <MuxUploader 
            onSuccess={onSuccess}
                endpoint={endpoint}
                id="video-uploader"
                className="hidden group/uploader"
             />
             <MuxUploaderDrop 
                muxUploader="video-uploader"
                className="group/drop">
                    <div slot="heading" className="flex flex-col items-center gap-6">
                        <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
                            <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-500" />
                        </div>
                        <div className="flex flex-col gap-2 text-center">
                            <p className="text-sm">Upload Video</p>
                            <p className="text-muted-foreground text-xs">Drag and drop your video file here or click to upload</p>
                        </div>
                        <MuxUploaderFileSelect muxUploader="video-uploader" >
                            <Button type="button" className=" rounded-full">Select Files</Button>
                        </MuxUploaderFileSelect>
                    </div>
                        <span slot="separator" className="hidden"></span>
                        <MuxUploaderStatus muxUploader="video-uploader" />
                        <MuxUploaderProgress muxUploader="video-uploader" type="percentage" className="text-sm"  />
                        <MuxUploaderProgress muxUploader="video-uploader" type="bar"  />

                </MuxUploaderDrop>
        </div>
    );
};