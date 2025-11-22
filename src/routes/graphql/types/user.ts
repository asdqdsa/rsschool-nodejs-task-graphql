import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';

const config = {
  name: 'User',
  description: 'User type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLString) },
    profile: ProfileType,
    posts: { type: new GraphQLNonNull(new GraphQLList(PostType)) },
    userSubscribedTo: { type: new GraphQLNonNull(new GraphQLList(UserType)) },
    subscribedToUser: { type: new GraphQLNonNull(new GraphQLList(UserType)) },
  }),
};

export const UserType = new GraphQLObjectType(config);

// type User {
//   id: UUID!
//   name: String!
//   balance: Float!
//   profile: Profile
//   posts: [Post!]!
//   userSubscribedTo: [User!]!
//   subscribedToUser: [User!]!
// }
