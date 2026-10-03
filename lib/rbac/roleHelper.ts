import { matchesPrefix } from "@/util/matcher";
import { Role } from "./types";

export const ROLE_PRIORITY = ["admin", "teacher", "student"] as const;

export function getPrimaryRole(roles: Role[]) {
    const roleSet = new Set(roles);
    const primaryRole: Role | undefined = ROLE_PRIORITY.find((r) => roleSet.has(r));
    return primaryRole;
}

export function isSubRole(roles: Role[], role: Role) {
    if (roles.length === 0) return false
    return !(getPrimaryRole(roles) === role);
}

export function getRoleByPathname(pathname: string): Role {
    if (matchesPrefix(pathname, "/admin")) return "admin";
    if (matchesPrefix(pathname, "/teacher")) return "teacher";
    if (matchesPrefix(pathname, "/student")) return "student";

    return "user";
}
