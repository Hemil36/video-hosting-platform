"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { videoSchema } from "@/db/schema";
import { VideoPlayer } from "@/modules/videos/ui/video-player";
import { VideoThumbnail } from "@/modules/videos/ui/video-thumbnail";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheckIcon, CopyIcon, Globe2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, use, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FormsectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormsectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading form</div>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const FormSectionSkeleton = () => {
  return <div className="h-96 animate-pulse bg-slate-200 rounded-lg" />;
};

export const FormSectionSuspense = ({ videoId }: FormsectionProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [isCopied , setisCopy] = useState(false);

  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: video,
  });

  if (!video) return null;
  const utils = trpc.useUtils();
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId });
      utils.categories.getMany.invalidate();
      toast.success("Video updated successfully");
    },
    onError: () => {
      toast.error("Error updating video");
    },
  });
  function onSubmit(data: z.infer<typeof videoSchema>) {
    console.log(data);
    update.mutate(data);
  }
  const onCopy = async ()=>{
    await navigator.clipboard.writeText(fullUrl);
    setisCopy(true);
    toast.success("Copied to clipboard");
    setTimeout(() => {
      setisCopy(false);
    }, 2000);

  }
const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex  gap-6">
          {/* <div className="w-[300px] flex-shrink-0">
            <VideoThumbnail
              thumbnailUrl={video?.thumbnailUrl}
              previewUrl={video?.previewUrl}
              duration={video?.duration || 0}
            />
          </div> */}
          <div className="w-1/3 flex-col gap-y-8 lg:col-span-2 ">
            <div className="flex flex-col gap-4 bg-gray-100 rounded-t-xl overflow-hidden h-fit">                  <div className="aspect-video overflow-hidden relative">
                    <VideoPlayer
                      playbackId={video.muxPlaybackId|| ""}
                      thumbnailUrl={video.thumbnailUrl}
                    />
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-y-4 bg-gray-100 rounded-md  ">
                    <div className=" flex  justify-between items-center gap-x-2">
                        <div className="flex flex-col gap-y-1">

                            <p className="text-muted-foreground text-xs"> Video Link</p>
                            <div className="flex  items-center ">
                                <Link href={`/video/${videoId}`} target="_blank" className="text-xs text-blue-500 hover:text-blue-600">
                                <p className="text-xs text-blue-500 max-w-[300px]  hover:text-blue-600 truncate ">
                                    {fullUrl}
                                </p>

                                </Link>
                                <Button type="button" variant="ghost" size="icon" className="flex-1 shrink-0" onClick={onCopy}>
                                {!isCopied ? <CopyIcon className="h-4 w-4" /> : <CopyCheckIcon />} 
                                </Button>

                            </div>
                        </div>
                    </div>
                        <div className="flex flex-col gap-y-1">
                        
                            <p className="text-xs text-muted-foreground ">Status</p>
                            <p className="text-xs font-semibold">{ video.muxStatus ? video.muxStatus.charAt(0).toUpperCase() + video.muxStatus.slice(1).toLowerCase() :""}</p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                        
                        <p className="text-xs text-muted-foreground">Subtitle status</p>
                        <p className="text-xs font-semibold">{ video.muxTrackStatus ? video.muxTrackStatus.charAt(0).toUpperCase() + video.muxTrackStatus.slice(1).toLowerCase() :"pending"}</p>
                    </div>

                </div>
                
            </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex-1"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field?.value || ""}
                        placeholder="Tell viewers about your video"
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe2Icon className="h-4 w-4" />
                            <span>Public</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <LockIcon className="h-4 w-4" />
                            <span>Private</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Who can see your video</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={update.isPending}
                className="mt-4"
              >
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </Card>
      <div className="text-xs text-muted-foreground">Video ID: {videoId}</div>
    </div>
  );
};
