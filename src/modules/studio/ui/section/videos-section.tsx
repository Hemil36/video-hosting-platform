"use client"

import { InfiniteScroller } from "@/components/infinite-scroller"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VideoThumbnail } from "@/modules/videos/ui/video-thumbnail"
import { trpc } from "@/trpc/client"
import { Globe2Icon, LockIcon } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


export const VideosSection = () => {
    return(
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Error loading videos</div>}>
            <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>

    )
}
export const VideosSectionSkeleton = () => {

    return(
        <div className="border-y">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead className="text-center">Visiblity</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Date</TableHead>
                            <TableHead className="text-center w-[100px]">Views</TableHead>
                            <TableHead className="text-center w-[100px]">Comments</TableHead>
                            <TableHead className="text-center w-[100px]">Likes</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {
                            Array.from({length: 5}).map((_,index) => (
                                <TableRow key={index} className="h-16 animate-pulse">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4 ">
                                            <Skeleton className="h-24 w-36" />
                                            <div className="flex flex-col gap-2 overflow-hidden">
                                                 <Skeleton className="h-4 w-48" />
                                                 <Skeleton className="h-4 w-32" />
                                                </div>
                                        </div>

                                    </TableCell>
                                    <TableCell className=" text-center">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>    
                                    <TableCell className="text-center">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                        </TableRow>
                            ))}
                        
</TableBody>

                  
                    </Table>

            </div>
    )
}


export const VideosSectionSuspense = () => {
    const [data,query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        {
            limit: 5},{
            getNextPageParam: (lastPage) => {
                return lastPage.nextCursor
            }
        },
    );
        return(
        <div>
            <div className="border-y">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead className="text-center">Visiblity</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Date</TableHead>
                            <TableHead className="text-center w-[100px]">Views</TableHead>
                            <TableHead className="text-center w-[100px]">Comments</TableHead>
                            <TableHead className="text-center w-[100px]">Likes</TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody >
                        {
                            data.pages.flatMap((page) => page.items).map((video) => (
                                <Link key={video.id} href={`/studio/videos/${video.id}`} className="hover:bg-muted/50 transition-colors cursor-pointer" legacyBehavior>
                                    <TableRow className="h-16">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4 ">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail thumbnailUrl={video.thumbnailUrl} previewUrl={video.previewUrl} duration={video.duration || 0}  />
                                            </div>
                                                <div className="flex flex-col gap-2 overflow-hidden">
                                                 <span className="text-md line-clamp-1">{video.title || "untitled"}</span>
                                                 <span className="text-xs line-clamp-1">{video.description ||"no description"}</span>
                                                </div>
                                        </div>

                                    </TableCell>
                                    <TableCell className=" text-center">
                                        <div className="flex items-center ">    

                                        {
                                            video.visibility === "public" ? (
                                                <LockIcon className="size-5 mr-2"  />
                                            ):(
                                                <Globe2Icon className="size-5 mr-2"  />
                                            )
                                            
                                        }
                                        {video.visibility}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                    {video.muxStatus ? video.muxStatus.charAt(0).toUpperCase() + video.muxStatus.slice(1).toLowerCase() : 'error'}                                    </TableCell>
                                    <TableCell className="text-center">
                                    {(() => {
                                                const date = new Date(video.createdAt);
                                                const day = date.getDate();
                                                const month = date.toLocaleString('en-US', { month: 'short' });
                                                const year = date.getFullYear();
                                                return `${day} ${month} ${year}`;
                                                })()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {video.views}   views
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {video.comments} comments
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {video.likes} likes
                                    </TableCell>
                                        
                                    </TableRow>
                                </Link>
                            
                        ))}
                    

                    </TableBody>
                    </Table>

            </div>
            {/* {JSON.stringify(data)} */}
            <InfiniteScroller 
                hasNextPage={query.hasNextPage}
                fetchNextPage={query.fetchNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
            />
        </div>
    )
}