"use client";

import { createContext, useContext } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import type { getRequestContext } from "@/lib/rbac/requestContext";

type RequestContextValue = Awaited<ReturnType<typeof getRequestContext>>;

type ServerValue = Omit<RequestContextValue, "clerkAuth" | "clerkUser">;

// Server-only fields that useAuth() doesn't return.
type ClerkAuthClient = Omit<
    RequestContextValue["clerkAuth"],
    | "sessionStatus"
    | "orgPermissions"
    | "factorVerificationAge"
    | "tokenType"
    | "debug"
    | "isAuthenticated"
    | "redirectToSignIn"
    | "redirectToSignUp"
>;

type ClientValue = ServerValue & {
    clerkAuth: ClerkAuthClient;
    clerkUser: RequestContextValue["clerkUser"];
};

const RequestContext = createContext<ClientValue | null>(null);

export function RequestContextProvider({ value, children }: { value: ServerValue; children: React.ReactNode }) {
    const clerkAuth = useAuth();
    const { user: clerkUser } = useUser();

    const ctx: ClientValue = {
        ...value,
        clerkAuth: clerkAuth as ClerkAuthClient,
        clerkUser: clerkUser as RequestContextValue["clerkUser"],
    };

    return <RequestContext.Provider value={ctx}>{children}</RequestContext.Provider>;
}

export function useRequestContext() {
    const ctx = useContext(RequestContext);
    if (!ctx) throw new Error("useRequestContext must be used inside <RequestContextProvider>");
    return ctx;
}
