import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { graphql } from "graphql";
import { PrismaClient } from "./lib/db";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
        type Mutation {
          createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
        }
    `,
    resolvers: {
      Query: {
        hello: () => `hey there, I am a gql server`,
        say: (_, { name }: { name: string }) => `hey ${name}`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await PrismaClient.user.create({
            data: {
              email,
              firstName,
              lastName,
              password,
              salt: "random_salt",
            },
          });
          return true;
        },
      },
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ msg: "server is running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`server: ${PORT}`));
}

startServer();
