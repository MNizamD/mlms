"use client";
import { Button } from "@heroui/react";
import { useClerk} from "@clerk/nextjs";
import { useRedirect } from "@/util/useRedirect";
import { Role } from "@/lib/rbac/types";

type AuthButtonType = {
    type: "signIn" | "signUp" | "signOut" | "home";
    role?: Role;
};

type variants = "ghost" | "danger" | "danger-soft" | "outline" | "primary" | "secondary" | "tertiary" | undefined;
type buttontypePropts = {
    text: string;
    function: () => void;
    variant: variants;
};
type ButtonTypes = {
    signIn: buttontypePropts;
    signUp: buttontypePropts;
    signOut: buttontypePropts;
    home: buttontypePropts;
};
export function AuthButton({ type, role }: AuthButtonType) {
    const clerk = useClerk();
    const buttonTypes = {
        signIn: {
            text: "Sign In",
            function: clerk.openSignIn,
            variant: undefined,
        },
        signUp: {
            text: "Sign Up",
            function: clerk.openSignUp,
            variant: undefined,
        },
        signOut: {
            text: "Sign Out",
            function: clerk.signOut,
            variant: "ghost",
        },
        home: {
            text: "Dashboard",
            function: () => !!role ? useRedirect(`/${role}/home`):null,
            variant: undefined,
        },
    } as ButtonTypes;
    const currentType = buttonTypes[type];
    return (
        <Button fullWidth size="lg" variant={currentType.variant} onClick={() => currentType.function()}>
            {currentType.text}
        </Button>
    );
}
