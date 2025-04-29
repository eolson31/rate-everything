import { NextResponse } from "next/server";
import { create_post_in_database, delete_user_in_database, get_all_posts_from_database } from "@/app/queries";

export async function GET(request: Request) {
    const posts = await get_all_posts_from_database();
    return NextResponse.json({success: true, posts: posts});
}

export async function POST(request: Request) {
    const body = await request.json();
    const {authorID, title, description, rating} = body;
    // Explicit error handling (not necessarily needed)
    if (!authorID) {
        return NextResponse.json({success: false, error: "Missing authorID field"}, {status: 404});
    }
    if (!title) {
        return NextResponse.json({success: false, error: "Missing title field"}, {status: 404});
    }
    if (!description) {
        return NextResponse.json({success: false, error: "Missing description field"}, {status: 404});
    }
    if (!rating) {
        return NextResponse.json({success: false, error: "Missing rating field"}, {status: 404});
    }
    // Create in database
    try {
        const newPost = await create_post_in_database(authorID, title, description, rating);
        return NextResponse.json({success: true, post: newPost});
    } catch (error) {
        const error_message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: error_message }, {status: 500})
    }
}

export async function DELETE(request: Request) {
    const {userID} = await request.json();
    // Verify a postID was provided
    if (!userID) {
        return NextResponse.json({success: false, error: "Missing userID field"}, {status: 404});
    }
    // Deleting from database
    try {
        delete_user_in_database(userID);
        return NextResponse.json({success: true});
    } catch (error) {
        const error_message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: error_message }, {status: 500});
    }
}
