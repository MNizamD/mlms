import { Prisma } from "@/prisma/generated/prisma/client";
import { PrismaRetype } from "@/lib/prisma/prismaCasting";
import z from "zod";

export const userProfileArgs = {
    omit: {
        created_at: true,
        deleted_at: true,
        updated_at: true,
    },
} satisfies Prisma.a_trans_profilesDefaultArgs;
export type UserProfile = PrismaRetype<Prisma.a_trans_profilesGetPayload<typeof userProfileArgs>> & {
    organization_ids: number[];
    college_ids: number[];
    program_ids: number[];
};

export const userProfileSchema = z.object({
    first_name: z.string().min(1, "Name is required"),
    middle_name: z.string().nullable(),
    last_name: z.string().min(1, "Lastname is required"),
    extension: z.string().nullable(),
    prefix: z.string().nullable(),
    organization_ids: z.number().int("Organization is required").array(),
    college_ids: z.number().int("Department is required").array(),
    program_ids: z.number().int("Program is required").array(),
    roles: z.string(),
}) satisfies z.ZodType<Omit<UserProfile, "id" | "user_id">>;
