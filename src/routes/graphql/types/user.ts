import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { GqlContext, UserPrismaClient } from './context.js';

const config = {
  name: 'User',
  description: 'User type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLString) },

    profile: {
      type: ProfileType,
      resolve: async (user: UserPrismaClient, _a: unknown, ctx: GqlContext) =>
        ctx.prisma.profile.findUnique({ where: { userId: user.id } }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),

      resolve: async (user: UserPrismaClient, _a: unknown, ctx: GqlContext) =>
        ctx.prisma.post.findMany({ where: { authorId: user.id } }),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user: UserPrismaClient, _a: unknown, ctx: GqlContext) =>
        ctx.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: { subscriberId: user.id },
            },
          },
        }),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (user: UserPrismaClient, _a: unknown, ctx: GqlContext) =>
        ctx.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        }),
    },
  }),
};

export const UserType = new GraphQLObjectType<UserPrismaClient, GqlContext>(config);

// type User {
//   id: UUID!
//   name: String!
//   balance: Float!
//   profile: Profile
//   posts: [Post!]!
//   userSubscribedTo: [User!]!
//   subscribedToUser: [User!]!
// }
