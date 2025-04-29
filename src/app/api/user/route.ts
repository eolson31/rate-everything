import { NextResponse } from "next/server";
import { create_user_in_database, get_user_in_database } from "@/app/queries";

export async function POST(request: Request) {
    const {username} = await request.json();
    let user = await get_user_in_database(username);

    // Create the user if it doesnt already exist
    if (!user) {
        try {
            user = await create_user_in_database(username)
        } catch (error) {
            const error_message = error instanceof Error ? error.message : "Unknown error";
            return NextResponse.json({ success: false, error: error_message }, {status: 500})
        }
    }
    return NextResponse.json({ success: true, user: user })
}
