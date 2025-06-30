import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  threshold = 0.1,
  rootMargin = '100px'
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  //stable callback that doesn't change on every render
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      //only trigger if element is intersecting AND we have more content AND not currently loading
      if (entry.isIntersecting && hasMore && !loading) {
        //debounce the intersection to prevent rapid firing
        timeoutRef.current = setTimeout(() => {
          setIsIntersecting(true);
        }, 100);
      } else {
        setIsIntersecting(false);
      }
    },
    [hasMore, loading] 
  );

  //set up the intersection observer
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    //clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    //create new observer with stable callback
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    observerRef.current.observe(element);

    //cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  //reset intersection state when conditions change
  useEffect(() => {
    if (!hasMore || loading) {
      setIsIntersecting(false);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { loadMoreRef, isIntersecting };
};