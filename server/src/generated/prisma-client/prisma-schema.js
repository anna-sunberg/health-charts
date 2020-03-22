module.exports = {
        typeDefs: /* GraphQL */ `type AggregatePost {
  count: Int!
}

type AggregateRunningWorkout {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

scalar Long

type Mutation {
  createPost(data: PostCreateInput!): Post!
  updatePost(data: PostUpdateInput!, where: PostWhereUniqueInput!): Post
  updateManyPosts(data: PostUpdateManyMutationInput!, where: PostWhereInput): BatchPayload!
  upsertPost(where: PostWhereUniqueInput!, create: PostCreateInput!, update: PostUpdateInput!): Post!
  deletePost(where: PostWhereUniqueInput!): Post
  deleteManyPosts(where: PostWhereInput): BatchPayload!
  createRunningWorkout(data: RunningWorkoutCreateInput!): RunningWorkout!
  updateRunningWorkout(data: RunningWorkoutUpdateInput!, where: RunningWorkoutWhereUniqueInput!): RunningWorkout
  updateManyRunningWorkouts(data: RunningWorkoutUpdateManyMutationInput!, where: RunningWorkoutWhereInput): BatchPayload!
  upsertRunningWorkout(where: RunningWorkoutWhereUniqueInput!, create: RunningWorkoutCreateInput!, update: RunningWorkoutUpdateInput!): RunningWorkout!
  deleteRunningWorkout(where: RunningWorkoutWhereUniqueInput!): RunningWorkout
  deleteManyRunningWorkouts(where: RunningWorkoutWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Post {
  id: ID!
  published: Boolean!
  title: String!
  content: String!
}

type PostConnection {
  pageInfo: PageInfo!
  edges: [PostEdge]!
  aggregate: AggregatePost!
}

input PostCreateInput {
  published: Boolean
  title: String!
  content: String!
}

type PostEdge {
  node: Post!
  cursor: String!
}

enum PostOrderByInput {
  id_ASC
  id_DESC
  published_ASC
  published_DESC
  title_ASC
  title_DESC
  content_ASC
  content_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PostPreviousValues {
  id: ID!
  published: Boolean!
  title: String!
  content: String!
}

type PostSubscriptionPayload {
  mutation: MutationType!
  node: Post
  updatedFields: [String!]
  previousValues: PostPreviousValues
}

input PostSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PostWhereInput
  AND: [PostSubscriptionWhereInput!]
  OR: [PostSubscriptionWhereInput!]
  NOT: [PostSubscriptionWhereInput!]
}

input PostUpdateInput {
  published: Boolean
  title: String
  content: String
}

input PostUpdateManyMutationInput {
  published: Boolean
  title: String
  content: String
}

input PostWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  published: Boolean
  published_not: Boolean
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  AND: [PostWhereInput!]
  OR: [PostWhereInput!]
  NOT: [PostWhereInput!]
}

input PostWhereUniqueInput {
  id: ID
}

type Query {
  post(where: PostWhereUniqueInput!): Post
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post]!
  postsConnection(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PostConnection!
  runningWorkout(where: RunningWorkoutWhereUniqueInput!): RunningWorkout
  runningWorkouts(where: RunningWorkoutWhereInput, orderBy: RunningWorkoutOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [RunningWorkout]!
  runningWorkoutsConnection(where: RunningWorkoutWhereInput, orderBy: RunningWorkoutOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): RunningWorkoutConnection!
  node(id: ID!): Node
}

type RunningWorkout {
  id: ID!
  createdAt: DateTime!
  email: String!
  startDate: DateTime!
  endDate: DateTime!
  totalDistance: Float!
  totalDistanceUnit: String!
  duration: Float!
  durationUnit: String!
  totalEnergyBurned: Float!
  totalEnergyBurnedUnit: String!
  totalAscent: Float
  totalAscentUnit: String
  sourceName: String
}

type RunningWorkoutConnection {
  pageInfo: PageInfo!
  edges: [RunningWorkoutEdge]!
  aggregate: AggregateRunningWorkout!
}

input RunningWorkoutCreateInput {
  email: String!
  startDate: DateTime!
  endDate: DateTime!
  totalDistance: Float!
  totalDistanceUnit: String
  duration: Float!
  durationUnit: String
  totalEnergyBurned: Float!
  totalEnergyBurnedUnit: String
  totalAscent: Float
  totalAscentUnit: String
  sourceName: String
}

type RunningWorkoutEdge {
  node: RunningWorkout!
  cursor: String!
}

enum RunningWorkoutOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  email_ASC
  email_DESC
  startDate_ASC
  startDate_DESC
  endDate_ASC
  endDate_DESC
  totalDistance_ASC
  totalDistance_DESC
  totalDistanceUnit_ASC
  totalDistanceUnit_DESC
  duration_ASC
  duration_DESC
  durationUnit_ASC
  durationUnit_DESC
  totalEnergyBurned_ASC
  totalEnergyBurned_DESC
  totalEnergyBurnedUnit_ASC
  totalEnergyBurnedUnit_DESC
  totalAscent_ASC
  totalAscent_DESC
  totalAscentUnit_ASC
  totalAscentUnit_DESC
  sourceName_ASC
  sourceName_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type RunningWorkoutPreviousValues {
  id: ID!
  createdAt: DateTime!
  email: String!
  startDate: DateTime!
  endDate: DateTime!
  totalDistance: Float!
  totalDistanceUnit: String!
  duration: Float!
  durationUnit: String!
  totalEnergyBurned: Float!
  totalEnergyBurnedUnit: String!
  totalAscent: Float
  totalAscentUnit: String
  sourceName: String
}

type RunningWorkoutSubscriptionPayload {
  mutation: MutationType!
  node: RunningWorkout
  updatedFields: [String!]
  previousValues: RunningWorkoutPreviousValues
}

input RunningWorkoutSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: RunningWorkoutWhereInput
  AND: [RunningWorkoutSubscriptionWhereInput!]
  OR: [RunningWorkoutSubscriptionWhereInput!]
  NOT: [RunningWorkoutSubscriptionWhereInput!]
}

input RunningWorkoutUpdateInput {
  email: String
  startDate: DateTime
  endDate: DateTime
  totalDistance: Float
  totalDistanceUnit: String
  duration: Float
  durationUnit: String
  totalEnergyBurned: Float
  totalEnergyBurnedUnit: String
  totalAscent: Float
  totalAscentUnit: String
  sourceName: String
}

input RunningWorkoutUpdateManyMutationInput {
  email: String
  startDate: DateTime
  endDate: DateTime
  totalDistance: Float
  totalDistanceUnit: String
  duration: Float
  durationUnit: String
  totalEnergyBurned: Float
  totalEnergyBurnedUnit: String
  totalAscent: Float
  totalAscentUnit: String
  sourceName: String
}

input RunningWorkoutWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  startDate: DateTime
  startDate_not: DateTime
  startDate_in: [DateTime!]
  startDate_not_in: [DateTime!]
  startDate_lt: DateTime
  startDate_lte: DateTime
  startDate_gt: DateTime
  startDate_gte: DateTime
  endDate: DateTime
  endDate_not: DateTime
  endDate_in: [DateTime!]
  endDate_not_in: [DateTime!]
  endDate_lt: DateTime
  endDate_lte: DateTime
  endDate_gt: DateTime
  endDate_gte: DateTime
  totalDistance: Float
  totalDistance_not: Float
  totalDistance_in: [Float!]
  totalDistance_not_in: [Float!]
  totalDistance_lt: Float
  totalDistance_lte: Float
  totalDistance_gt: Float
  totalDistance_gte: Float
  totalDistanceUnit: String
  totalDistanceUnit_not: String
  totalDistanceUnit_in: [String!]
  totalDistanceUnit_not_in: [String!]
  totalDistanceUnit_lt: String
  totalDistanceUnit_lte: String
  totalDistanceUnit_gt: String
  totalDistanceUnit_gte: String
  totalDistanceUnit_contains: String
  totalDistanceUnit_not_contains: String
  totalDistanceUnit_starts_with: String
  totalDistanceUnit_not_starts_with: String
  totalDistanceUnit_ends_with: String
  totalDistanceUnit_not_ends_with: String
  duration: Float
  duration_not: Float
  duration_in: [Float!]
  duration_not_in: [Float!]
  duration_lt: Float
  duration_lte: Float
  duration_gt: Float
  duration_gte: Float
  durationUnit: String
  durationUnit_not: String
  durationUnit_in: [String!]
  durationUnit_not_in: [String!]
  durationUnit_lt: String
  durationUnit_lte: String
  durationUnit_gt: String
  durationUnit_gte: String
  durationUnit_contains: String
  durationUnit_not_contains: String
  durationUnit_starts_with: String
  durationUnit_not_starts_with: String
  durationUnit_ends_with: String
  durationUnit_not_ends_with: String
  totalEnergyBurned: Float
  totalEnergyBurned_not: Float
  totalEnergyBurned_in: [Float!]
  totalEnergyBurned_not_in: [Float!]
  totalEnergyBurned_lt: Float
  totalEnergyBurned_lte: Float
  totalEnergyBurned_gt: Float
  totalEnergyBurned_gte: Float
  totalEnergyBurnedUnit: String
  totalEnergyBurnedUnit_not: String
  totalEnergyBurnedUnit_in: [String!]
  totalEnergyBurnedUnit_not_in: [String!]
  totalEnergyBurnedUnit_lt: String
  totalEnergyBurnedUnit_lte: String
  totalEnergyBurnedUnit_gt: String
  totalEnergyBurnedUnit_gte: String
  totalEnergyBurnedUnit_contains: String
  totalEnergyBurnedUnit_not_contains: String
  totalEnergyBurnedUnit_starts_with: String
  totalEnergyBurnedUnit_not_starts_with: String
  totalEnergyBurnedUnit_ends_with: String
  totalEnergyBurnedUnit_not_ends_with: String
  totalAscent: Float
  totalAscent_not: Float
  totalAscent_in: [Float!]
  totalAscent_not_in: [Float!]
  totalAscent_lt: Float
  totalAscent_lte: Float
  totalAscent_gt: Float
  totalAscent_gte: Float
  totalAscentUnit: String
  totalAscentUnit_not: String
  totalAscentUnit_in: [String!]
  totalAscentUnit_not_in: [String!]
  totalAscentUnit_lt: String
  totalAscentUnit_lte: String
  totalAscentUnit_gt: String
  totalAscentUnit_gte: String
  totalAscentUnit_contains: String
  totalAscentUnit_not_contains: String
  totalAscentUnit_starts_with: String
  totalAscentUnit_not_starts_with: String
  totalAscentUnit_ends_with: String
  totalAscentUnit_not_ends_with: String
  sourceName: String
  sourceName_not: String
  sourceName_in: [String!]
  sourceName_not_in: [String!]
  sourceName_lt: String
  sourceName_lte: String
  sourceName_gt: String
  sourceName_gte: String
  sourceName_contains: String
  sourceName_not_contains: String
  sourceName_starts_with: String
  sourceName_not_starts_with: String
  sourceName_ends_with: String
  sourceName_not_ends_with: String
  AND: [RunningWorkoutWhereInput!]
  OR: [RunningWorkoutWhereInput!]
  NOT: [RunningWorkoutWhereInput!]
}

input RunningWorkoutWhereUniqueInput {
  id: ID
}

type Subscription {
  post(where: PostSubscriptionWhereInput): PostSubscriptionPayload
  runningWorkout(where: RunningWorkoutSubscriptionWhereInput): RunningWorkoutSubscriptionPayload
}
`
      }
    