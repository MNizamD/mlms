// app/page.tsx
import { getRequestContext } from "@/lib/rbac/requestContext";
import { formatFullname } from "@/util/formatter";
import { AuthButton } from "../clerk/authbuttons";
export async function HomePage() {
    const { clerkAuth, clerkUser, userProfile } = await getRequestContext();
    const fullName = userProfile ? formatFullname(userProfile) : clerkUser ? formatFullname(clerkUser) : "";
    return (
        <main className="w-full h-full flex items-center justify-center">
            <div className="max-w-100 flex items-center justify-center flex-col text-center gap-4">
                <h1 className="">Ma-Learn</h1>
                <p className="text-muted wrap-break-word text-sm">
                    Learn, connect, and manage everything you need in one simple place.
                </p>
                {!clerkAuth.userId ? (
                    <>
                        <AuthButton type="signIn" />
                        <AuthButton type="signUp" />
                    </>
                ) : (
                    <>
                        <p className="mt-5 -mb-2.5 text-muted text-sm">You are logged in as:</p>
                        <div className="w-full flex justify-evenly items-center">
                            <img src={clerkUser?.imageUrl} className="rounded-full size-15" />
                            <div className="text-start">
                                <p>{fullName}</p>
                                <p className="text-muted">{clerkAuth.sessionClaims.roles.join(" | ")}</p>
                            </div>
                        </div>
                        <AuthButton type="home" role={clerkAuth.sessionClaims.roles.at(0)} />
                        <AuthButton type="signOut" />
                    </>
                )}
            </div>
        </main>
    );
}
