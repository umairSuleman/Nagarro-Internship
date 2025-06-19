import { useSelector } from "react-redux";
import { selectIsLoading, selectError } from "@/store/slices/globalSlice";
import type { RootState } from "@/store";

export const useAsyncOperation = (requestId ?: string) => {
    const loading = useSelector((state: RootState) => 
        requestId ? selectIsLoading(state, requestId) : Object.values(state.global.loading).some(Boolean)
    );

    const error = useSelector((state: RootState) =>
        requestId ? selectError(state, requestId) : Object.values(state.global.errors).find(Boolean) || null
    );

    return { loading, error };
};


