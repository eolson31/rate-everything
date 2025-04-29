import { NextResponse } from "next/server";
import { create_post_in_database } from "@/app/queries";

export async function POST(request: Request) {
    const body = await request.json();
    const {authorID, title, description, rating} = body;

    try {
        const newPost = await create_post_in_database(authorID, title, description, rating);
        return NextResponse.json({success: true, post: newPost});
    } catch (error) {
        const error_message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: error_message }, {status: 500})
    }
}
