import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import UserModel from "../models/usersModel.js";
import * as dotenv from "dotenv";

// loading .env file
dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: "comBay",
};

const passportStrategy = new JwtStrategy(jwtOptions, async function (
  jwt_payload,
  done
) {
  try {
    const user = await UserModel.findOne({ _id: jwt_payload.sub });

    if (!user) {
      console.log("create new account");
      return done(null, false);
    }
    if (user) {
      console.log("user found");
      return done(null, user);
    }
  } catch (err) {
    console.log("invalid token");
    return done(err, false);
  }
});

export default passportStrategy;
