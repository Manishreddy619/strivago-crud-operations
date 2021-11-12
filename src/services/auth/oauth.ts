import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import userModel from "../customers/schema.js";
import { JWTAuthenticate } from "./tools.js";
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `http://localhost:3001/customers/googleRedirect`,
  },
  async (accessToken, refreshToken, googleProfile, passportNext) => {
    console.log(process.env.GOOGLE_OAUTH_ID);
    try {
      console.log("google profile", googleProfile);

      const user = await userModel.findOne({ googleId: googleProfile.id });
      if (user) {
        const tokens = await JWTAuthenticate(user);
        passportNext(null, { tokens });
      } else {
        const newUser = {
          email: googleProfile.emails[0].value,
          googleId: googleProfile.id,
        };
        const createdUser = new userModel(newUser);
        const savedUser = await createdUser.save();
        const tokens = await JWTAuthenticate(savedUser);
        passportNext(null, { tokens });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);
passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});
export default googleStrategy;
