import { NextResponse } from "next/server";
import { create_post_in_database, delete_post_in_database, get_all_posts_from_database } from "@/app/queries";
import { broadcast } from "../event_stream/server_side_events";

export async function GET(request: Request) {
    const posts = await get_all_posts_from_database();
    return NextResponse.json({success: true, posts: posts});
}

export async function POST(request: Request) {
    const body = await request.json();
    const {authorID, title, description, rating} = body;
    // Explicit error handling
    if (!authorID || !title || !description || !rating) {
        return NextResponse.json({success: false, error: "Missing a required field: authorID, title, description, and rating"}, {status: 404});
    }
    // Create in database
    try {
        const newPost = await create_post_in_database(authorID, title, description, rating)
        // Notify clients
        broadcast({type: 'newPost', post: newPost});

        return NextResponse.json({success: true, post: newPost});
    } catch (error) {
        const error_message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: error_message }, {status: 500})
    }
}

export async function DELETE(request: Request) {
    const {postID} = await request.json();
    // Verify a postID was provided
    if (!postID) {
        return NextResponse.json({success: false, error: "Missing postID field"}, {status: 404});
    }
    // Deleting from database
    try {
        delete_post_in_database(postID);
        broadcast({type: 'deletePost', postID: postID})
        return NextResponse.json({success: true});
    } catch (error) {
        const error_message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: error_message }, {status: 500});
    }
}
