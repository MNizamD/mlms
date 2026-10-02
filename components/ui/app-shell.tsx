"use client";
import { useState } from "react";
import Link from "next/link";
import { GraduationCap, LogOut, Menu, MoreHorizontal, X, User, Settings } from "lucide-react";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRequestContext } from "../providers/requestContext";

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
    const { pathname } = useRequestContext();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { user } = useUser();
    const { signOut } = useClerk();

    const fullName = user?.fullName ?? user?.username ?? "";
    const role = (user?.publicMetadata?.role as string | undefined) ?? "";
    const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
    const initials = fullName.charAt(0).toUpperCase() || "?";

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
                <div className="border-t border-divider p-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar size="sm">
                            <Avatar.Image alt={fullName} src={user?.imageUrl} />
                            <Avatar.Fallback>{initials}</Avatar.Fallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
                            {roleLabel && <p className="text-xs text-default-500">{roleLabel}</p>}
                        </div>

                        <Dropdown>
                            <Button isIconOnly size="sm" variant="ghost" aria-label="User menu">
                                <MoreHorizontal className="w-4 h-4 text-default-500" />
                            </Button>

                            <Dropdown.Popover placement="top end">
                                <Dropdown.Menu>
                                    <Dropdown.Item id="profile" textValue="Profile">
                                        <User className="w-4 h-4" />
                                        <Label>Profile</Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="settings" textValue="Settings">
                                        <Settings className="w-4 h-4" />
                                        <Label>Settings</Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        id="signout"
                                        textValue="Sign out"
                                        variant="danger"
                                        onAction={() => signOut({ redirectUrl: "/" })}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <Label>Sign out</Label>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={closeSidebar} aria-hidden />
            )}

            {/* Main content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    <p>{pathname}</p>
                    <p>{JSON.stringify(navItems)}</p>
                    {children}
                </div>
            </main>
        </div>
    );
}

function Brand() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-foreground">MaLearn</span>
        </div>
    );
}
