import { Post, PrismaClient, Profile, User } from '@prisma/client';

export type GqlContext = {
  prisma: PrismaClient;
};

export type UserPrismaClient = User;
export type ProfilePrismaClient = Profile;
export type PostPrismaClient = Post;
