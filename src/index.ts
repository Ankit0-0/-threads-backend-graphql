import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { graphql } from "graphql";

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
    `,
    resolvers: {
      Query: {
        hello: () => `hey there, I am a gql server`,
        say: (_, { name }: { name: string }) => `hey ${name}`,
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
