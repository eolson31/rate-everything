"use server";

import { prisma } from "@/lib/prisma";

export async function get_posts() {
    const posts = await prisma.post.findMany();
    return posts;
}