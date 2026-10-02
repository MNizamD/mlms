import { getRequestContext } from "@/lib/rbac/requestContext";
import { redirect } from "next/navigation";
import { RequestContextProvider } from "./requestContext";

const PUBLIC_PATHS = new Set(["/", "/unauthorized"]);
const ONBOARDING_PATH = "/onboarding";

const ROLE_PRIORITY = ["admin", "teacher", "student"] as const;
type Role = (typeof ROLE_PRIORITY)[number];

const ROLE_ACCESS: Record<Role, string[]> = {
    admin: ["/admin", "/teacher", "/student"],
    teacher: ["/teacher", "/student"],
    student: ["/student"],
};

const ROLE_HOME: Record<Role, string> = {
    admin: "/admin/home",
    teacher: "/teacher/home",
    student: "/student/home",
};

const ROLE_PREFIXES = ["/admin", "/teacher", "/student"];

const matchesPrefix = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(prefix);

async function AuthLayer({ children }: { children: React.ReactNode }) {
    const { clerkAuth, pathname, userProfile } = await getRequestContext();
    const { userId, sessionClaims } = clerkAuth;

    const isPublicPath = PUBLIC_PATHS.has(pathname);

    // 1. Authenticated users on a public path → render as-is, no redirects.
    //    This is the ONLY place this decision is made, so nothing below can override it.
    if (isPublicPath) {
        return <>{children}</>;
    }

    // 2. Unauthenticated → public paths only
    if (!userId && !isPublicPath) {
        redirect("/unauthorized");
    }

    const userRoles = sessionClaims?.roles ?? [];

    // // 3. Onboarding gate
    const isUserBoarded = !!userProfile && userRoles.some((r) => r !== "user");

    if (!isUserBoarded && pathname !== ONBOARDING_PATH) {
        redirect(ONBOARDING_PATH);
    }
    if (isUserBoarded && pathname === ONBOARDING_PATH) {
        redirect("/");
    }

    // 4. Role-based access
    const primaryRole: Role | undefined = ROLE_PRIORITY.find((r) => userRoles.includes(r));

    const isRolePath = ROLE_PREFIXES.some((p) => matchesPrefix(pathname, p));

    if (isRolePath) {
        if (!primaryRole) redirect("/");

        const canAccess = ROLE_ACCESS[primaryRole].some((p) => matchesPrefix(pathname, p));
        if (!canAccess) redirect(ROLE_HOME[primaryRole]);
    }

    return <>{children}</>;
}

// app/(authenticated)/layout.tsx (server)
async function AuthProvider({ children }: { children: React.ReactNode }) {
    const ctx = await getRequestContext();

    return (
        <AuthLayer>
            <RequestContextProvider value={{ pathname: ctx.pathname, userProfile: ctx.userProfile }}>
                {children}
            </RequestContextProvider>
        </AuthLayer>
    );
}

export default AuthProvider;
