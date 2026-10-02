// lib/request-context.ts
import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";
import { prismaJson } from "../prisma/prismaCasting";
import { UserProfile } from "@/types/UserProfile";

export const getRequestContext = cache(async () => {
    const h = await headers();
    const pathname = h.get("x-pathname") ?? "/";

    const [clerkAuth, clerkUser] = await Promise.all([auth(), currentUser()]);
    const profile = !!clerkAuth.userId
        ? prismaJson(
              await prisma.a_trans_profiles.findFirst({
                  where: { user_id: clerkAuth.userId },
                  select: {
                      id: true,
                      first_name: true,
                      middle_name: true,
                      last_name: true,
                      prefix: true,
                      extension: true,
                      a_map_profile_organization: {
                          select: {
                              organization_id: true,
                          },
                      },
                      a_map_profile_college: {
                          select: {
                              college_id: true,
                          },
                      },
                      a_map_profile_program: {
                          select: {
                              program_id: true,
                          },
                      },
                  },
              }),
          )
        : null;

    const userProfile =
        profile &&
        ({
            id: profile.id,
            first_name: profile.first_name,
            middle_name: profile.middle_name,
            last_name: profile.last_name,
            prefix: profile.prefix,
            extension: profile.extension,
            organization_ids: profile.a_map_profile_organization.map((r) => r.organization_id),
            college_ids: profile.a_map_profile_college.map((r) => r.college_id),
            program_ids: profile.a_map_profile_program.map((r) => r.program_id),
            user_id: clerkAuth.userId!,
        } as UserProfile);

    return {
        pathname,
        userProfile,
        clerkAuth,
        clerkUser,
    };
});
