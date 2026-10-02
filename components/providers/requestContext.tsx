"use client";

import { createContext, useContext } from "react";
import type { UserProfile } from "@/types/UserProfile";

type RequestContextValue = {
    pathname: string;
    userProfile: UserProfile | null;
};

const RequestContext = createContext<RequestContextValue | null>(null);

export function RequestContextProvider({ value, children }: { value: RequestContextValue; children: React.ReactNode }) {
    return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequestContext() {
    const ctx = useContext(RequestContext);
    if (!ctx) throw new Error("useRequestContext must be used inside <RequestContextProvider>");
    return ctx;
}
