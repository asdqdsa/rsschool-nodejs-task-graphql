import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { UUID } from 'crypto';
import {
  GraphQLFieldConfigMap,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  graphql,
} from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GqlContext } from './types/context.js';
import { MemberType, MemberTypeIdEnum } from './types/member.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
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
      const ctx: GqlContext = { prisma: fastify.prisma };
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        // contextValue: { prisma },
        contextValue: ctx,
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

const rootFields: GraphQLFieldConfigMap<unknown, GqlContext> = {
  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (_p, _a, ctx: GqlContext) => ctx.prisma.user.findMany(),
  },
  user: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_p, args: { id: UUID }, ctx: GqlContext) =>
      ctx.prisma.user.findUnique({
        where: { id: args.id },
      }),
  },

  posts: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
    resolve: async (_p, _a, ctx: GqlContext) => ctx.prisma.post.findMany(),
  },
  post: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_p, args: { id: UUID }, ctx: GqlContext) =>
      ctx.prisma.post.findUnique({
        where: { id: args.id },
      }),
  },

  profiles: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
    resolve: async (_p, _a, ctx: GqlContext) => ctx.prisma.profile.findMany(),
  },
  profile: {
    type: ProfileType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_p, args: { id: UUID }, ctx: GqlContext) =>
      ctx.prisma.profile.findUnique({
        where: { id: args.id },
      }),
  },

  memberTypes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
    resolve: async (_p, _a, ctx: GqlContext) => ctx.prisma.memberType.findMany(),
  },
  memberType: {
    type: MemberType,
    args: {
      id: { type: MemberTypeIdEnum },
    },
    resolve: async (_p, args: { id: MemberTypeId }, ctx: GqlContext) =>
      ctx.prisma.memberType.findUnique({
        where: { id: args.id },
      }),
  },
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: rootFields,
  }),
});

export default plugin;
