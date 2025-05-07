import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body received:", body);

    const { postId, delta } = body;

    if (typeof postId !== "number" || typeof delta !== "number") {
      console.error("Invalid input types:", { postId, delta });
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        voteCount: {
          increment: delta,
        },
      },
    });

    console.log("Post updated successfully:", updatedPost);

    return NextResponse.json({ success: true, count: updatedPost.voteCount });
  } catch (error: any) {
    console.error("Error in /api/vote:", error.message || error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}