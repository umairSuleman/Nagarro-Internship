import { useSelector } from "react-redux";
import { selectIsLoading, selectError, selectGlobalLoading, selectGlobalErrors } from "@/store/slices/globalSlice";
import type { RootState } from "@/store";

export const useAsyncOperation = (requestId?: string) => {
    // If requestId is provided, get specific loading/error state
    const loading = useSelector((state: RootState) => 
        requestId ? selectIsLoading(state, requestId) : selectGlobalLoading(state)
    );

    const error = useSelector((state: RootState) =>
        requestId ? selectError(state, requestId) : selectGlobalErrors(state)[0] || null
    );

    return { loading, error };
};

// Hook for checking if a specific action type is loading
export const useActionLoading = (actionType: string) => {
    const loading = useSelector((state: RootState) => 
        Object.keys(state.global.loading).some(key => 
            key.includes(actionType) && state.global.loading[key]
        )
    );

    return loading;
};

// Hook for getting global loading state
export const useGlobalLoading = () => {
    return useSelector((state: RootState) => selectGlobalLoading(state));
};

// Hook for getting all global errors
export const useGlobalErrors = () => {
    return useSelector((state: RootState) => selectGlobalErrors(state));
};