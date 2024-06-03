import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { graphql } from "graphql";
import { User } from "./user";

async function createApoloGraphQlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
            type Query {
              hello: String
            }
            type Mutation {
              ${User.mutations}
            }
        `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  await gqlServer.start();

  return gqlServer;
}

export default createApoloGraphQlServer;

// const gqlServer = new ApolloServer({
//   typeDefs: `
//       type Query {
//           hello: String
//           say(name: String): String
//       }
//       type Mutation {
//         createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
//       }
//   `,
//   resolvers: {
//     Query: {
//       hello: () => `hey there, I am a gql server`,
//       say: (_, { name }: { name: string }) => `hey ${name}`,
//     },
//     Mutation: {
//       createUser: async (
//         _,
//         {
//           firstName,
//           lastName,
//           email,
//           password,
//         }: {
//           firstName: string;
//           lastName: string;
//           email: string;
//           password: string;
//         }
//       ) => {
//         await PrismaClient.user.create({
//           data: {
//             email,
//             firstName,
//             lastName,
//             password,
//             salt: "random_salt",
//           },
//         });
//         return true;
//       },
//     },
//   },
// });

// await gqlServer.start();
