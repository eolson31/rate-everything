
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { postId, delta } = body;

  if (typeof postId !== "number" || typeof delta !== "number") {
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        vote: { increment: delta },
      },
    });

    return NextResponse.json({ success: true, count: updatedPost.votes });
  } catch (error) {
    console.error("Vote update error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}