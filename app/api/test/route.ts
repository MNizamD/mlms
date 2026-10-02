import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
// import prisma from "@/prisma/prisma";


// GET /api/users
export async function GET() {

    const users = await prisma.a_trans_profiles.findMany();
    return NextResponse.json(
        {
            message: "Users fetched successfully",
            users: users,
        },
        { status: 200 },
    );
}

// POST /api/users
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
        }

        // Example: save using Prisma here
        // const user = await prisma.user.create({ data: { name, email } });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: { name, email },
            },
            { status: 201 },
        );
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }
}
