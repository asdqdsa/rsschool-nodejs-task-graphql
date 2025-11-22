import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

const config = {
  name: 'Post',
  description: 'Post type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
};

export const PostType = new GraphQLObjectType(config);

// type Post {
//   id: UUID!
//   title: String!
//   content: String!
// }
