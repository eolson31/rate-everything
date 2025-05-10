import { NextRequest, NextResponse } from "next/server";
import { delete_upvote_in_database, get_all_user_votes, update_upvote_in_database } from "@/app/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { postId, userId, isUpvote, toDelete } = body;

    if (typeof postId !== "number" || typeof userId !== "number") {
      console.error("Invalid input types:", { postId, userId });
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    if (toDelete) {
      var vote = await delete_upvote_in_database(postId, userId);
    } else {
      var vote = await update_upvote_in_database(postId, userId, isUpvote);
    }

    console.log("Post updated successfully:", vote);

    return NextResponse.json({ success: true, vote: vote });
  } catch (error: any) {
    console.error("Error in /api/vote:", error.message || error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = Number(request.nextUrl.searchParams.get("userId"));

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
  }

  try {
    const votes = await get_all_user_votes(userId);
    return NextResponse.json({success: true, votes });
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return NextResponse.json({success: false, error: error}, {status: 500});
  }
}
