import { useFormContext } from "react-hook-form";

export function useSafeFormContext() {
    try {
        return useFormContext();
    } catch {
        return null;
    }
}
