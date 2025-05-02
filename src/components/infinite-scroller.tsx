import { useIntersectionObserver } from "@/hooks/use-intersection-observor";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollerProps {
    isManual ? : boolean;
    hasNextPage : boolean;
    fetchNextPage : () => void;
    isFetchingNextPage : boolean;
}


export const InfiniteScroller = (props : InfiniteScrollerProps) => {
    const { isManual, hasNextPage, fetchNextPage, isFetchingNextPage } = props;
    const {targetRef , isIntersection} = useIntersectionObserver({
        threshold: 0.5,
        rootMargin:"100px"
    })

    useEffect(() => {
        if (isManual) return;
        if (isIntersection && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }
    , [hasNextPage, isFetchingNextPage, fetchNextPage, isManual , isIntersection]);
    return (
        <div className="flex justify-center ">
            <div ref={targetRef} className="h-1" />
            {/* Uncomment this if you want to use a button to load more items */}
            {hasNextPage  ? (
                <Button
                    onClick={fetchNextPage}
                    disabled={isFetchingNextPage && isManual}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Load More
                </Button>
            ) : <p>You have reached the end...</p>}
            {isFetchingNextPage && <p>Loading...</p>}
        </div>
    )
}

