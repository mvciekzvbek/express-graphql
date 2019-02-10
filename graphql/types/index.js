import { mergeTypes } from 'merge-graphql-schemas';

// import Event from "./Event";
// import User from "./User";

const root = `
  type Query {
    hello: String
  }
`;

// const typeDefs = [Event, User];
const typeDefs = [root];


export default mergeTypes(typeDefs)