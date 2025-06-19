import { useSelector } from "react-redux";
import { selectIsLoading, selectError } from "@/store/slices/globalSlice";
import type { RootState } from "@/store";

export const useAsyncOperation = (requestId ?: string) => {
    const loading = useSelector((state: RootState) => 
        requestId ? selectIsLoading(state, requestId) : false
    );

    const error = useSelector((state: RootState) =>
        requestId ? selectError(state, requestId) : null
    );

    return { loading, error };
};


