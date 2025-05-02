import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const [isIntersection, setIsIntersection] = useState(false);
    const targetRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsIntersection(true);
                } else {
                    setIsIntersection(false);
                }
            });
        }, options);

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
                observer.disconnect();
            
        };
    }
    , [options]);
    return { targetRef, isIntersection };
}
