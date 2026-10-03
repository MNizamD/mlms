import prisma from "@/prisma/prisma";
import { userProfileSchema } from "@/types/UserProfile";
import { omit } from "@/util/objectFiltering";
import { auth, clerkClient as cc } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
    try {
        const [{ userId }, body, clerkClient] = await Promise.all([
            auth.protect(), //
            request.json(),
            cc(),
        ]);

        // Throws ZodError if the body is invalid
        const data = userProfileSchema.parse(body);

        await prisma.$transaction(async (tx) => {
            await Promise.all([
                tx.a_trans_profiles.create({
                    data: {
                        user_id: userId,
                        a_map_profile_organization: {
                            createMany: {
                                data: data.organization_ids.map((orgID) => ({
                                    organization_id: orgID,
                                })),
                                skipDuplicates: true,
                            },
                        },
                        a_map_profile_college: {
                            createMany: {
                                data: data.college_ids.map((collegeID) => ({
                                    college_id: collegeID,
                                })),
                                skipDuplicates: true,
                            },
                        },
                        a_map_profile_program: {
                            createMany: {
                                data: data.program_ids.map((programID) => ({
                                    program_id: programID,
                                })),
                                skipDuplicates: true,
                            },
                        },
                        ...omit(data, ["organization_ids", "college_ids", "program_ids", "roles"]),
                    },
                }),
                clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        roles: [data.roles],
                    },
                }),
            ]);
        });
        return NextResponse.json(
            {
                message: "Account created successfully",
                data,
            },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid request body",
                    // errors: z.treeifyError(error),
                },
                { status: 400 },
            );
        }

        // Invalid JSON, such as: { name: "Nizam" }
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    message: "Request body must contain valid JSON.",
                },
                { status: 400 },
            );
        }

        console.error("[POST /api/onboarding] Unhandled error:", error);
        return NextResponse.json({ message: `Internal server error: ${error}` }, { status: 500 });
    }
}
