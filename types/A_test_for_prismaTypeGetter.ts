import { Prisma } from "@/prisma/generated/prisma/client";
import { prismaJson, PrismaRetype } from "@/lib/prisma/prismaCasting";

// Get a table's props plainly
type UserProfile = Prisma.a_trans_profilesModel;

// Get a table's props granularly
const userProfileArgs = { include: { a_trans_classes: true } } satisfies Prisma.a_trans_profilesDefaultArgs;
type UserProfileWithClasses = Prisma.a_trans_profilesGetPayload<typeof userProfileArgs>;

const userProfileNormal: UserProfile = {
    id: "0001",
    first_name: "Mike",
    middle_name: "G.",
    last_name: "Jason",
    extension: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    prefix: null,
    user_id: "0001"
};

///////////////////////////////////////////////////////////////////
// prismaJson() - a function that converts an object's properties
// PrismaRetype - a type that converts another type's properties
//   Convertion coverage:
//   - Date to String timestamp
//   - BigInt to Number
//   - BigInt[] to Number[] or Date[] to String[]
///////////////////////////////////////////////////////////////////
const userProfileSerialized = prismaJson(userProfileNormal);
const userProfileSerialized2: PrismaRetype<UserProfile> = {
    id: "0001",
    first_name: "Mike",
    middle_name: "G.",
    last_name: "Jason",
    extension: null,
    created_at: "2026-01-01T12:00:00.000",
    updated_at: "2026-01-01T12:00:00.000",
    deleted_at: null,
    prefix: null,
    user_id: "0001",
};
