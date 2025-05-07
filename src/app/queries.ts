"use server";

import { prisma } from "@/lib/prisma";

export async function get_all_posts_from_database(/*currentUserId: number*/) {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    name: true,
                },
            }, votes: {
                //where: { userId: currentUserId },
                select: { isUpvote: true },
                take: 1,
            }
        },
    });
    return posts.map((p) => ({
        id:          p.id,
        title:       p.title,
        description: p.description,
        rating:      p.rating,
        createdAt:   p.createdAt,
        author:      p.author,
        votes:       p.voteCount,
        userVote:    p.votes.length
                    ? p.votes[0].isUpvote
                      ? 1
                      : -1
                    : 0,
      }));
}

export async function get_user_in_database(username: string) {
    return await prisma.user.findFirst({
        where: {
            name: username,
        },
    });
}

export async function create_user_in_database(username: string) {
    return await prisma.user.create({
        data: {
            name: username
        }
    })
}

export async function create_post_in_database(userID: number, title: string, description: string, rating: number) {
    return await prisma.post.create({
        data: {
            title,
            description,
            rating,
            author: {
                connect: {id: userID},
            },
        },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
    })
}

export async function delete_post_in_database(postID: number) {
    return await prisma.post.delete({
        where: {id: postID},
    });
}

export async function delete_user_in_database(userID: number) {
    return await prisma.user.delete({
        where: {id: userID},
    });
}