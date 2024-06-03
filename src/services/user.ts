import { createHmac, randomBytes } from "node:crypto";
import { PrismaClient } from "../lib/db";
import JWT from "jsonwebtoken";
// import "dotenv/config";

// const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_SECRET = "secret";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static genereteHash(salt: string, password: string) {
    const hasedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    return hasedPassword;
  }

  public static createUser(payload: CreateUserPayload) {
    const { email, firstName, password, lastName } = payload;

    const salt = randomBytes(32).toString("hex");

    const hasedPassword = UserService.genereteHash(salt, password);

    return PrismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hasedPassword,
        salt,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return PrismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;

    const user = await UserService.getUserByEmail(email);

    if (!user) throw new Error("user not found");

    const userSalt = user.salt;
    const UserHasedPassword = UserService.genereteHash(userSalt, password);

    if (UserHasedPassword !== user.password) {
      throw new Error("incorrect password");
    }

    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }
}

export default UserService;
