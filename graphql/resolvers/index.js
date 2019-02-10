import { mergeResolvers } from "merge-graphql-schemas";

// import User from "./User/";
// import Post from "./Event/";

const root = {
    Query: {
        hello: () => {
            return 'Hello world!';
        }
    }
}


// const resolvers = [User, Event];
const resolvers = [root];

export default mergeResolvers(resolvers);