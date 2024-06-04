import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApoloGraphQlServer from "./graphql";
import UserService from "./services/user";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ msg: "server is running" });
  });
  const gqlServer = await createApoloGraphQlServer();

  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`server: ${PORT}`));
}

startServer();
