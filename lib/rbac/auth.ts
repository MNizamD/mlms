import { Role, Todo, ClerkUser } from "./types";

// export const ROLE_PERMISSIONS = {
//     admin: [
//         // Admins get all permissions
//         // ...Object.values(Permission),
//     ],

//     teacher: [
//         // Class
//         Permission.CREATE_CLASS,
//         Permission.READ_CLASS,
//         Permission.UPDATE_CLASS,
//         Permission.DELETE_CLASS,
//     ],
//     student: [Permission.READ_CLASS],
// } as const;

type Permissions = {
    todos: {
        dataType: Todo;
        action: "view" | "create" | "update" | "delete";
    };
    users: {
        dataType: ClerkUser;
        action: "view" | "create" | "update" | "delete";
    }
};
type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: ClerkUser, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermission = {
    [R in Role]:
        | Partial<{
              [Key in keyof Permissions]: Partial<{
                  [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
              }>;
          }>
        | boolean;
};

const ROLE_PERMISSIONS = {
    admin: true,
    user: false,
    teacher: {
        todos: {
            create: true,
            update: true,
            view: true,
            delete: (user, todo) => todo.completed,
        },
    },
    student: {
        todos: {
            view: (user, todo) => !user.blockedBy.includes(todo.authorId),
        },
    }
} as const satisfies RolesWithPermission;

export function hasPermission<Resource extends keyof Permissions>(
    user: ClerkUser,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"],
) {
    return user.roles.some((role) => {
        const userRole = (ROLE_PERMISSIONS as RolesWithPermission)[role];
        if (typeof userRole === "boolean") return userRole;
        const permission = userRole?.[resource]?.[action];
        if (!permission) return false;
        if (typeof permission === "boolean") return permission;
        return data != null && permission(user, data);
    });
}
