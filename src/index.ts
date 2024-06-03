import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApoloGraphQlServer from "./graphql";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ msg: "server is running" });
  });
  const gqlServer = await createApoloGraphQlServer();

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`server: ${PORT}`));
}

startServer();
