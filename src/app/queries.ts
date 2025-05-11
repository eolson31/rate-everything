"use server";

import { prisma } from "@/lib/prisma";

export async function get_all_posts_from_database() {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    name: true,
                },
            },
            votes: {
                select: { isUpvote: true },
            }
        },
    });
    return posts;
}

export async function get_all_user_votes(userID: number) {
    return await prisma.vote.findMany({
        where: {
            userId: userID,
        },
        select: {
            postId: true,
            isUpvote: true,
        }
    })
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
            votes: true,
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

export async function update_upvote_in_database(postID: number, userID: number, isUpvote: boolean) {
    const existing_vote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                postId: postID,
                userId: userID,
            },
        },
    })

    if (existing_vote) {
        // Update existing
        return prisma.vote.update({
            where: {
                userId_postId: {
                    postId: postID,
                    userId: userID,
                },
            },
            data: {
                isUpvote,
            },
        });
    } else {
        // Create new entry
        return await prisma.vote.create({
            data: {
                userId: userID,
                postId: postID,
                isUpvote,
            },
        });
    }
}

export async function delete_upvote_in_database(postID: number, userID: number) {
    return prisma.vote.delete({
        where: {
            userId_postId: {
                postId: postID,
                userId: userID,
            },
        },
    });
}
