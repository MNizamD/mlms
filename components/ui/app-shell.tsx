"use client";
import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X, User, Settings, SunMoon } from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { useClerk } from "@clerk/nextjs";
import { useRequestContext } from "../providers/requestContext";
import { getRoleByPathname, isSubRole as isr } from "@/lib/rbac/roleHelper";
import { useTheme } from "next-themes";
import BasicDropdown from "../heroui/basic-dropdown";
import Brand from "./brand";

type NavItem = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
};

type AppShellProps = {
    navItems: NavItem[];
    children: React.ReactNode;
};

export function AppShell({ navItems, children }: AppShellProps) {
    const { theme, setTheme } = useTheme();
    const { pathname, clerkAuth, clerkUser } = useRequestContext();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { signOut } = useClerk();

    const fullName = clerkUser?.fullName ?? clerkUser?.username ?? "";
    const roleLabel = clerkAuth?.sessionClaims?.roles.join(" | ") ?? "";
    const initials = fullName.charAt(0).toUpperCase() || "?";
    const pathRole = getRoleByPathname(pathname);
    const isSubRole = isr(clerkAuth.sessionClaims?.roles ?? [], pathRole);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Mobile header */}
            <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-divider bg-content1">
                <Brand />
                <Button
                    variant="ghost"
                    isIconOnly
                    size="sm"
                    aria-label="Toggle sidebar"
                    onPress={() => setSidebarOpen((v) => !v)}
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-full w-64 bg-background border-r border-divider transform transition-transform lg:translate-x-0 flex flex-col ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-16 flex items-center px-5 border-b border-divider shrink-0">
                    <Brand />
                </div>

                {/* Nav */}
                <nav className="p-3 space-y-1 overflow-y-auto flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-accent text-accent-foreground font-bold"
                                        : "text-default-700 hover:bg-default-100"
                                }`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User card + menu (pinned to bottom) */}
                {!!isSubRole && (
                    <div className="bg-warning text-center text-white">You are viewing as a {pathRole}</div>
                )}
                <div className="border-t border-divider p-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar size="sm">
                            <Avatar.Image alt={fullName} src={clerkUser?.imageUrl} />
                            <Avatar.Fallback>{initials}</Avatar.Fallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
                            {roleLabel && <p className="text-xs text-default-500">{roleLabel}</p>}
                        </div>
                        <BasicDropdown
                            items={[
                                {
                                    id: "profile",
                                    textValue: "Profile",
                                    isDisabled: true,
                                    icon: User,
                                },
                                {
                                    id: "settings",
                                    textValue: "Settings",
                                    isDisabled: true,
                                    icon: Settings,
                                },
                                {
                                    id: "theme",
                                    textValue: "Theme",
                                    icon: SunMoon,
                                    onAction: () => setTheme(theme === "dark" ? "light" : "dark"),
                                },
                                {
                                    id: "signout",
                                    textValue: "Sign Out",
                                    icon: LogOut,
                                    onAction: () => signOut({ redirectUrl: "/" }),
                                },
                            ]}
                            placement="top end"
                        />
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={closeSidebar} aria-hidden />
            )}

            {/* Main content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {/* <p>{pathname}</p> */}
                    {/* <p>{JSON.stringify(navItems)}</p> */}
                    {/* <p>{JSON.stringify(requestContext)}</p> */}
                    {children}
                </div>
            </main>
        </div>
    );
}
