import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'Member id',
  values: {
    BASIC: { value: 'BASIC', description: 'Basic member' },
    BUSINESS: { value: 'BUSINESS', description: 'Business member' },
  },
});

const config = {
  name: 'Member',
  description: 'Member type',
  fields: () => ({
    id: { type: MemberTypeIdEnum },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
};

export const MemberType = new GraphQLObjectType(config);

// type MemberType {
//   id: MemberTypeId!
//   discount: Float!
//   postsLimitPerMonth: Int!
// }

// enum MemberTypeId {
//   BASIC
//   BUSINESS
// }

// export enum MemberTypeId {
//   BASIC = 'BASIC',
//   BUSINESS = 'BUSINESS',
// }
