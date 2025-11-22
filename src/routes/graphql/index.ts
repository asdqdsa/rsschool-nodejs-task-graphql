import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  graphql,
} from 'graphql';
import { UserType } from './types/user.js';
import { FastifyInstance } from 'fastify';
import { UUIDType } from './types/uuid.js';
import { UUID } from 'crypto';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType, MemberTypeIdEnum } from './types/member.js';
import { MemberTypeId } from '../member-types/schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma },
      });
    },
  });
};

// type RootQueryType {
//   memberTypes: [MemberType!]!
//   memberType(id: MemberTypeId!): MemberType
//   users: [User!]!
//   user(id: UUID!): User
//   posts: [Post!]!
//   post(id: UUID!): Post
//   profiles: [Profile!]!
//   profile(id: UUID!): Profile
// }

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async (_p, _a, ctx: FastifyInstance) => ctx.prisma.user.findMany(),
      },

      user: {
        type: new GraphQLNonNull(UserType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_p, args: { id: UUID }, ctx: FastifyInstance) =>
          ctx.prisma.user.findUniqueOrThrow({
            where: { id: args.id },
          }),
      },

      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
        resolve: async (_p, _a, ctx: FastifyInstance) => ctx.prisma.post.findMany(),
      },

      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_p, args: { id: UUID }, ctx: FastifyInstance) =>
          ctx.prisma.post.findUnique({
            where: { id: args.id },
          }),
      },

      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
        resolve: async (_p, _a, ctx: FastifyInstance) => ctx.prisma.profile.findMany(),
      },

      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_p, args: { id: UUID }, ctx: FastifyInstance) =>
          ctx.prisma.profile.findUnique({
            where: { id: args.id },
          }),
      },

      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async (_p, _a, ctx: FastifyInstance) => ctx.prisma.memberType.findMany(),
      },

      memberType: {
        type: new GraphQLNonNull(MemberType),
        args: {
          id: { type: MemberTypeIdEnum },
        },
        resolve: async (_p, args: { id: MemberTypeId }, ctx: FastifyInstance) =>
          ctx.prisma.memberType.findUnique({
            where: { id: args.id },
          }),
      },
    },
  }),
});

export default plugin;
