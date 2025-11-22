import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './member.js';

const config = {
  name: 'Profile',
  description: 'Profile type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: { type: new GraphQLNonNull(MemberType) },
  }),
};

export const ProfileType = new GraphQLObjectType(config);

// // type Profile {
// //   id: UUID!
// //   isMale: Boolean!
// //   yearOfBirth: Int!
// //   memberType: MemberType!
// }
