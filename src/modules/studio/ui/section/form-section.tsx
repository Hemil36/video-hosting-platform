"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { videoSchema } from "@/db/schema";
import { VideoThumbnail } from "@/modules/videos/ui/video-thumbnail";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe2Icon, LockIcon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FormsectionProps {
    videoId: string;
}



export const FormSection = ({videoId}: FormsectionProps) => {
    return(
        <Suspense fallback={<FormSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Error loading form</div>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

export const FormSectionSkeleton = () => {
    return(
        <div className="h-96 animate-pulse bg-slate-200 rounded-lg" />
    )
}

export const FormSectionSuspense = ({videoId}: FormsectionProps) => {
    const [categories] = trpc.categories.getMany.useSuspenseQuery();
    const  [video]  = trpc.studio.getOne.useSuspenseQuery({id: videoId});

    
    const form = useForm<z.infer<typeof videoSchema>>({
        resolver: zodResolver(videoSchema),
        defaultValues: video
    });
    
    if(!video) return null;
    const utils = trpc.useUtils();
    const update = trpc.videos.update.useMutation(({
        onSuccess: () => {
            utils.studio.getOne.invalidate({id: videoId});
            utils.categories.getMany.invalidate();
            toast.success("Video updated successfully")
        },
        onError: () => {
            toast.error("Error updating video")
        }

    }));
    function onSubmit(data : z.infer<typeof videoSchema >) {
       
        console.log(data);
       update.mutate(data)
    }

    return(
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex gap-6">
                    <div className="w-[300px] flex-shrink-0">
                        <VideoThumbnail 
                            thumbnailUrl={video?.thumbnailUrl} 
                            previewUrl={video?.previewUrl} 
                            duration={video?.duration || 0} 
                        />
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
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
                                        <FormDescription>
                                            Who can see your video
                                        </FormDescription>
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
                            defaultValue={field.value||""}
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
                                </Select >
                               
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
            <div className="text-xs text-muted-foreground">
                Video ID: {videoId}
            </div>
        </div>
    );
}
