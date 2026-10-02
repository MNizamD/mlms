export type Todo = {
    id: number,
    title: string,
    authorId: string, 
    completed: boolean,
    invitedUsers: string[]
}

export type Role = "admin" | "teacher" | "student" | "user"
export type ClerkUser = {
    id: string;
    blockedBy: string[];
    roles: Role[]
}