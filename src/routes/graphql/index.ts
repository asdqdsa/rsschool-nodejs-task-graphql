import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  graphql,
} from 'graphql';
import { UserType } from './types/user.js';

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
        resolve: async () => {},
      },
      hello: {
        type: GraphQLString,
        resolve: async () => 'Hello, world!',
      },
    },
  }),
});

export default plugin;
