import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GqlContext, ProfilePrismaClient } from './context.js';
import { MemberType } from './member.js';
import { UUIDType } from './uuid.js';

const config = {
  name: 'Profile',
  description: 'Profile type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (profile: ProfilePrismaClient, _a: unknown, ctx: GqlContext) =>
        ctx.prisma.memberType.findUnique({ where: { id: profile.memberTypeId } }),
    },
  }),
};

export const ProfileType = new GraphQLObjectType(config);

// // type Profile {
// //   id: UUID!
// //   isMale: Boolean!
// //   yearOfBirth: Int!
// //   memberType: MemberType!
// }
